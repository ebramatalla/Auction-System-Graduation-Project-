import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import classes from './AddNewAuction.module.css';
import Input from '../../../UI/Input/input';

import SellerDashboardContent from '../SellerModule';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import { AddNewAuctionAPI } from '../../../../Api/SellerApi';
import { getAllCategories } from '../../../../Api/CategoryApi';
import useHttp from '../../../../CustomHooks/useHttp';

import { toast, ToastContainer } from 'react-toastify';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner'
import { isBefore } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AddAuction = () => {
	const [AddAuction, setAddAuction] = useState('');
	const idToken = useSelector(store => store.AuthData.idToken);
	const [loading , setLoading] = useState(false)

	const {
		sendRequest: sendRequestCategoryList,
		status: statusCategoryList,
		data: dataCategoryList,
	} = useHttp(getAllCategories);
	const { sendRequest, status, error } = useHttp(AddNewAuctionAPI);

	// get all categories name
	useEffect(() => {
		sendRequestCategoryList(idToken);
	}, [sendRequestCategoryList]);

	// start refs
	const TitleRef = useRef();
	const ProductNameRef = useRef();
	const BrandRef = useRef();
	const StatusRef = useRef();
	const BasePriceRef = useRef();
	const StartDateRef = useRef();
	const ProductShortDescRef = useRef();
	const ProductDetailsDescRef = useRef();
	const ImageRef = useRef();
	// end refs

	const [CategoryId, setCategoryId] = useState();

	// FirstCategory_id
	const checkCategory =
		statusCategoryList === 'completed' &&
		dataCategoryList &&
		dataCategoryList.length !== 0;

	let ProductImageErrorMessage = ''
	// start validation
	const validateText = value => value.trim() !== '' && value.trim().length >= 3;
	const ValidateDate = value => isBefore(new Date(), new Date(value));
	const Navigate = useNavigate()

	// end validation
	const getAllCategoriesName = checkCategory ? (
		<select
			className="form-select"
			onChange={e => setCategoryId(e.target.value)}
		>
			<option value="none" disabled selected>
				Select an category
			</option>
			{dataCategoryList.map(category => (
				<option key={category._id} value={category._id}>
					{' '}
					{category.name}{' '}
				</option>
			))}
		</select>
	) : (
		<p className="text-danger"> No Category Now </p>
	);

	const ValidateForm = () => {
		if (
			validateText(TitleRef.current.value) &&
			validateText(ProductNameRef.current.value) &&
			validateText(ProductShortDescRef.current.value) &&
			validateText(BasePriceRef.current.value)&&
			ValidateDate(StartDateRef.current.value)
		) {
			return true;
		} else {
			toast.error(
				'Please Fill All Details Required For Adding new Auction ❌ ',
			);
			return;
		}
	};

	// handle upload image
	const [pictures, setPictures] = useState([]);
	let tempArr = [];

	const handleImageUpload = e => {
		[...e.target.files].map(file => tempArr.push(file));
		setPictures(tempArr);
	};

	// end handle upload image
	const submitHandler = e => {
		e.preventDefault();
		setLoading(true)
		if (ValidateForm()) {
			const AuctionDetails = {
				title: TitleRef.current.value,
				item: {
					name: ProductNameRef.current.value,
					shortDescription: ProductShortDescRef.current.value,
					brand: BrandRef.current.value,
					detailedDescription: ProductDetailsDescRef.current.value
						? ProductDetailsDescRef.current.value
						: ProductShortDescRef.current.value,
					status: StatusRef.current.value,
					images: pictures,
				},
				startDate: StartDateRef.current.value,
				category: CategoryId,
				basePrice: BasePriceRef.current.value,
			};
			sendRequest({ AuctionDetails, idToken });
			setAddAuction(Math.random());
		}
	};

	useEffect(() => {
		if (status === 'completed') {
			setLoading(false)
			toast.success('Done, new Auction added successfully 💖🐱‍👤');
			const timer = setTimeout(()=>{
				Navigate('/seller-dashboard/viewAllAuctions')
			},10000)
			return ()=>clearTimeout(timer)
		}
	}, [status, AddAuction]);

	useEffect(() => {
		if (error) {
			setLoading(false)
			toast.error(error);
		}
	}, [error, AddAuction]);

	return (
		<SellerDashboardContent>
			<PageContent>
				{loading && <LoadingSpinner /> }
				<ToastContainer theme="dark" />
				<PageHeader text="Add New Auction" />
				<div>
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
										validateText={validateText}
										ref={TitleRef}
										errorMassage="please enter Product Title "
										inputValue=" Title"
										id="Title"
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
										validateText={validateText}
										ref={BasePriceRef}
										errorMassage="please enter Base Price "
										id="ProductPrice"
									/>
								</div>

								{/* start [start date] */}
								<div className="col-lg-6">
									<label className={'text-light fw-bold fs-6 py-2 '}>
										Select Start Date
									</label>
									<Input
										type="datetime-local"
										placeholder=""
										validateText={ValidateDate}
										ref={StartDateRef}
										errorMassage="please enter valid date  "
										id="startDate"
									/>
								</div>
							</div>

							<div className="row">
								{/* start short desc */}
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
										validateText={validateText}
										ref={ProductShortDescRef}
										errorMassage="please enter Product Description "
										inputValue=" Product Description"
										id="ProductDesc"
									/>
								</div>

								{/* start details desc */}
								<div className={`col-lg-6`}>
									<label
										htmlFor="DetailsDesc"
										className={'text-light fw-bold fs-6 py-2 '}
									>
										product Details Description
									</label>
									<textarea
										placeholder="type here..."
										className={`form-control ${classes.ProductDetailed}`}
										id="DetailsDesc"
										ref={ProductDetailsDescRef}
									></textarea>
								</div>
							</div>

							<div className="row">
								{/* product status */}
								<div className={`${classes.TextArea} col-lg-6`}>
									<label
										htmlFor="Status"
										className={'text-light fw-bold fs-6 py-2 '}
									>
										Status
									</label>
									<Input
										type="text"
										placeholder=""
										validateText={validateText}
										ref={StatusRef}
										errorMassage="please enter status of item "
										inputValue=""
										id="Status"
									/>
								</div>
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
										ref={ImageRef}
										onChange={handleImageUpload}
									/>
									{ProductImageErrorMessage && (
										<p className="text-danger"> {ProductImageErrorMessage} </p>
									)}
								</div>
							</div>

							<button className={`btn bg-danger text-light ${classes.bntstyl}`}>
								Add Auction
							</button>
						</div>
					</form>
				</div>
			</PageContent>
		</SellerDashboardContent>
	);
};

export default AddAuction;
