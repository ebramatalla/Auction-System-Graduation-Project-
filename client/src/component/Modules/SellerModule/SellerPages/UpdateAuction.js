import React, { useEffect, useRef, useState } from 'react';
import SellerDashboardContent from '../SellerModule';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import { getAllCategories } from '../../../../Api/CategoryApi';
import { UpdateAuctionHandler } from '../../../../Api/AuctionsApi';
import classes from './UpdateAuction.module.css';
import Input from '../../../UI/Input/input';

import { toast, ToastContainer } from 'react-toastify';
import useHttp from './../../../../CustomHooks/useHttp';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getSingleAuction } from './../../../../Api/AuctionsApi';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';



const UpdateAuction = () => {
	const [loading , setLoading] = useState(false)
	const location = useLocation();
	const AuctionId = new URLSearchParams(location.search).get('id');
	// start validation
	const validateText = value => value.trim() !== '' && value.trim().length >= 3;

	const idToken = useSelector(store => store.AuthData.idToken);
	const {
		sendRequest: sendRequestTOGetAuctions,
		status: statusTOGetAuctions,
		data: dataTOGetAuctions,
	} = useHttp(getSingleAuction);

	useEffect(() => {
		sendRequestTOGetAuctions(AuctionId);
	}, [sendRequestTOGetAuctions]);

	const [auctionData, setAuctionData] = useState();

	useEffect(() => {
		if (dataTOGetAuctions && statusTOGetAuctions === 'completed') {
			setAuctionData(dataTOGetAuctions);
		}
	}, [sendRequestTOGetAuctions, statusTOGetAuctions]);
	const {
		sendRequest: sendRequestUpdateAuction,
		status: statusUpdateAuction,
		error: errorUpdateAuction,
	} = useHttp(UpdateAuctionHandler);
	// get all categories name
	const [CategoryId, setCategoryId] = useState();

	const {
		sendRequest: sendRequestCategoryList,
		status: statusCategoryList,
		data: dataCategoryList,
	} = useHttp(getAllCategories);
	useEffect(() => {
		sendRequestCategoryList(idToken);
	}, [sendRequestCategoryList]);

	const checkCategory =
		statusCategoryList === 'completed' &&
		dataCategoryList &&
		dataCategoryList.length !== 0;

	const getAllCategoriesName = checkCategory ? (
		<select
			className="form-select"
			onChange={e => setCategoryId(e.target.value)}
		>
			{/* <option value="none" disabled>
				{auctionData && auctionData.category.name
					? auctionData.category.name
					: 'Select an category'}
			</option> */}
			<option value="none" disabled >
				Select an category
			</option>
			{dataCategoryList.map(category => (
				<option key={category._id} value= {category._id}  >
					{category.name}
				</option>
			))}
		</select>
	) : (
		<p className="text-danger"> No Category Now </p>
	);

	// start refs
	const TitleRef = useRef();
	const ProductNameRef = useRef();
	const BrandRef = useRef();
	const StatusRef = useRef();
	const BasePriceRef = useRef();
	const ProductShortDescRef = useRef();
	const ProductDetailsDescRef = useRef();

	// // end refs
	// handle upload image
	const [pictures, setPictures] = useState([]);
	let tempArr = [];

	const handleImageUpload = e => {
		[...e.target.files].map(file => tempArr.push(file));
		setPictures(tempArr);
	};

	const submitHandler = e => {
		e.preventDefault();
		setLoading(true)

		const auctionData = {
			title: TitleRef.current.value,
			item: {
				_id: dataTOGetAuctions && dataTOGetAuctions.item._id,
				name: ProductNameRef.current.value,
				shortDescription: ProductShortDescRef.current.value,
				brand: BrandRef.current.value,
				detailedDescription: ProductDetailsDescRef.current.value
					? ProductDetailsDescRef.current.value
					: ProductShortDescRef.current.value,
				status: StatusRef.current.value,
				images: pictures,
			},
			category: CategoryId ? CategoryId : dataTOGetAuctions.category._id ,
			basePrice: BasePriceRef.current.value,
		};
		sendRequestUpdateAuction({
			AuctionId: AuctionId,
			auctionData: auctionData,
			idToken: idToken,
		});
	};
	useEffect(() => {
		if (statusUpdateAuction === 'completed') {
			setLoading(false)
			toast.success('Auction Updated Successfully');
		} else if(statusUpdateAuction === 'error') {
			setLoading(false)
			toast.error(errorUpdateAuction);
		}
	}, [statusUpdateAuction, errorUpdateAuction]);

	return (
		<SellerDashboardContent>
			<PageContent>
				{loading && <LoadingSpinner /> }
				<ToastContainer theme="dark" />

				<PageHeader text="Edit Auction" />
				<div>
					{auctionData && (
						<form onSubmit={submitHandler}>
							<div className="container">
								<div className="row">
									{/* start Product Title */}
									<div className={`col-lg-6 `}>
										<label
											htmlFor="Title"
											className={'text-light fw-bold fs-6 py-2'}
										>
											Title
										</label>
										<Input
											type="text"
											placeholder=""
											ref={TitleRef}
											errorMassage="please enter Product Title "
											value={auctionData && auctionData.title}
											id="Title"
											// value="title"
										/>
									</div>

									{/* start Product Name */}
									<div className={`col-lg`}>
										<label
											htmlFor="ProductName"
											className={'text-light fw-bold fs-6 py-2'}
										>
											product Name
										</label>
										<Input
											type="text"
											placeholder=""
											validateText={validateText}
											ref={ProductNameRef}
											errorMassage="please enter Product Name "
											value={auctionData && auctionData.item.name}
											id="ProductName"
										/>
									</div>
								</div>

								<div className={` row ${classes.SelectStyl}`}>
									{/* start Brand Name */}
									<div className={`${classes.TextArea} col-lg-6`}>
										<label
											htmlFor="Brand"
											className={'text-light fw-bold fs-6 py-2 '}
										>
											Brand Name
										</label>
										<Input
											type="text"
											placeholder=""
											validateText={validateText}
											ref={BrandRef}
											errorMassage="please enter Product Description "
											value={auctionData && auctionData.item.brand}
											id="Brand"
										/>
									</div>

									{/* start select Category Name */}
									<div className={`col-lg-6 `}>
										<label className={'text-light fw-bold fs-6 py-2  '}>
											select Category
										</label>
										{getAllCategoriesName}
									</div>
								</div>

								<div className={`row ${classes.SelectStyl}`}>
									{/* start base price */}
									<div className="col-lg-6">
										<label className={'text-light fw-bold fs-6 py-2 '}>
											Base Price
										</label>
										<Input
											type="number"
											placeholder=""
											ref={BasePriceRef}
											errorMassage="please enter Base Price "
											value={auctionData && auctionData.basePrice}
											id="productPrice"
										/>
									</div>
									<div className={`${classes.TextArea} col-lg-6`}>
										<label
											htmlFor="Status"
											className={'text-light fw-bold fs-6 py-2 '}
										>
											Item Status
										</label>
										<Input
											type="text"
											placeholder=""
											ref={StatusRef}
											errorMassage="please enter status of item "
											value={auctionData && auctionData.item.status}
											id="Status"
										/>
									</div>
								</div>

								<div className="row">
									<div className={`col-lg-6`}>
										<label
											htmlFor="productDesc"
											className={'text-light fw-bold fs-6 py-2 '}
										>
											product short Description
										</label>
										<Input
											type="text"
											placeholder=""
											ref={ProductShortDescRef}
											errorMassage="please enter product Description "
											inputValue=" product Description"
											id="productDesc"
											value={auctionData && auctionData.item.shortDescription ? auctionData.item.shortDescription : ''}
										/>
									</div>

									{/* start details desc */}
									<div className={`col-lg-6`}>
										<label
											htmlFor="productDetailsDesc"
											className={'text-light fw-bold fs-6 py-2 '}
										>
											product Details Description
										</label>
										<textarea
											placeholder="type here..."
											className={`form-control ${classes.ProductDetailed}`}
											id="productDetailsDesc"
											ref={ProductDetailsDescRef}
											defaultValue={auctionData && auctionData.item.detailedDescription ? auctionData.item.detailedDescription : ''}
										></textarea>
									</div>
								</div>

								<div className="row">
									{/* product image */}
									<div className="col-6">
										<label className={'text-light fw-bold fs-6 py-2 '}>
											product Images
										</label>
										<input
											type="file"
											name="image"
											multiple
											className={`form-control ${classes.productImage}`}
											onChange={handleImageUpload}
										/>
									</div>
								</div>

								<button className={`btn bg-danger ${classes.bntstyl}`}>
									Save Changes
								</button>
							</div>
						</form>
					)}
				</div>
			</PageContent>
		</SellerDashboardContent>
	);
};

export default UpdateAuction;
