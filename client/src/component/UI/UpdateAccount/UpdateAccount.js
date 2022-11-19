import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { UpdateAccount } from '../../Modules/SellerModule/sellerApi';
import PageContent from '../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../UI/Page Header/pageHeader';
import userImg from '../../../assets/user.png';
import classes from './UpdateAccount.module.css';
import Input from '../../UI/Input/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePen } from '@fortawesome/free-solid-svg-icons';
import useHttp from '../../../CustomHooks/useHttp';
import { toast, ToastContainer } from 'react-toastify';
import { getUserId } from '../../../Api/usersApi';
import LoadingSpinner from '../Loading/LoadingSpinner';
import ChangePassword from '../ChangePasswordModal/ChangePasswordModal';


const UpdateAccountForUsers = () => {
	const [ShowModal, setShowModal] = useState(false);

	const idToken = useSelector(store => store.AuthData.idToken);
	const role = useSelector(store => store.AuthData.role);
	const email = useSelector(store => store.AuthData.email);
	const [loading , setLoading] = useState(false)

	const phoneNumber = useRef();
	const nameRef = useRef();
	const addressRef = useRef();


	const ImageRef = useRef();
	const ChangeImageHandler = e => {
		ImageRef.current.click();
	};

	const [ImageSrc , setImageSrc] = useState('')
	const [userData , setUserData] = useState({})
	const { sendRequest, error, status } = useHttp(UpdateAccount);
	const { sendRequest:sendRequestForGetInfo,  status:statusForGetInfo , data:dataForGetInfo , error : errorForGetInfo } = useHttp(getUserId);


	// start get all data about user from db
	useEffect(() => {
		// const id = userId
		sendRequestForGetInfo(idToken);
	},[sendRequestForGetInfo]);

	useEffect(() => {
		if (statusForGetInfo === 'completed') {
			setUserData(dataForGetInfo)
		}
		else if(statusForGetInfo ==='error') {
			toast.error(errorForGetInfo);
		}
	}, [statusForGetInfo]);

	// start update Account
	const submitHandler = e => {
		setLoading(true)
		e.preventDefault();
		let accountData
		let userData = 
		{ name: nameRef.current.value,
			phoneNumber: phoneNumber.current.value.trim(),
			address: addressRef.current.value.trim()
		}
		let updateData = {}
		Object.entries(userData).map((key)=>{
			console.log(key[1])
			if(key[1]){
				updateData[key[0]] = key[1]
			} 
		})
		if(ImageSrc){
			accountData = {...updateData , image: ImageSrc}
			// accountData = {
			// 	name: nameRef.current.value,
			// 	phoneNumber: phoneNumber.current.value.trim(),
			// 	address: addressRef.current.value.trim(),
				
			// };
		}
		else{
			accountData = {...updateData}
		}
		let path ;
		 if(role === 'admin' || role === 'employee'){
			path = 'admin/profile'

		}else if(role === 'seller'){
			path = 'seller/profile'
		}else{
			path= 'buyer/profile'
		}

		sendRequest({ accountData, idToken, path} );
	};

	React.useEffect(() => {
		if (status === 'completed') {
			setLoading(false)
			toast.success('Account Updated Successfully');
			const timer = setTimeout(()=>{
				window.location.reload()
			},2000)
			return () => clearTimeout(timer)
			// const path = role ==='seller' ? '/seller-dashboard': '/buyer-dashboard'
			// Navigate(path)

		} 
		if (status === 'error'){
			setLoading(false)
			toast.error(error);
		}
	}, [status]);

	// end Update Account
	return (
		<React.Fragment>
			<PageContent className={classes.PageContentStyle}>
				{loading && <LoadingSpinner />}
				<ToastContainer theme="dark" />
				<PageHeader text="Edit Your Account" />
				{Object.keys(userData).length !== 0 &&
					statusForGetInfo === 'completed' && (
						<form className="container-fluid" onSubmit={submitHandler}>
							<section className="header_container position-relative">
								<div className={`${classes.UpdateAccount} `}>
									<img
										src={
											userData.image && userData.image.url
												? `${userData['image']['url']}`
												: userImg
										}
										className={classes.imageProfile}
										alt="userImage"
									/>
									<button
										type="button"
										className={`btn ${classes.btnChangeImage}`}
										onClick={ChangeImageHandler}
									>
										<FontAwesomeIcon icon={faSquarePen} />
										<input
											type="file"
											className="d-none"
											ref={ImageRef}
											onChange={e => setImageSrc(e.target.files[0])}
										/>
									</button>
								</div>
								{/* E-mail And Role Number */}
								<div className="row my-4">
									<div className={'col-6  text-light fw-bold fs-5 py-2'}>
										<label>E-mail : {email} </label>
									</div>
									<div className={'col-6 text-light fw-bold fs-5 py-2 '}>
										<label> Type : {role} </label>
									</div>
								</div>
								{/* Name And Phone Number */}
								<div className="row">
									<div className={`col-lg-6`}>
										<label
											htmlFor="UserName"
											className={'text-light fw-bold fs-5 py-2'}
										>
											User Name
										</label>
										<Input
											type="text"
											ref={nameRef}
											id="UserName"
											value={userData.name ? userData.name : ''}
										/>
									</div>
									<div className={`col-lg`}>
										<label
											htmlFor="PhoneNumber "
											className={'text-light fw-bold fs-5 py-2'}
										>
											Phone Number
										</label>
										<Input
											type="text"
											ref={phoneNumber}
											id="PhoneNumber "
											value={userData.phoneNumber ? userData.phoneNumber : ''}
										/>
									</div>
								</div>

								{/* National Number And Address */}
								<div className="row">
									<div className={`col-lg-6 `}>
										<label
											htmlFor="Address"
											className={'text-light fw-bold fs-5 py-2'}
										>
											Address
										</label>
										<Input
											type="text"
											ref={addressRef}
											inputValue="Product Name"
											id="Address"
											value={userData.address && userData.address}
										/>
									</div>
								</div>
								{/* Save Changes Button */}
								<button
									className={`btn d-inline-block bg-success text-light fw-bold  ${(role === 'admin' || role === 'employee') ?  ' col-md-5 m-4 col-sm-12' :  'col-4 float-end mx-3 bg-danger' } `}
									>
										Save Changes
								</button>

								{/* Change password when role admin or employee */}

								{(role === 'admin' || role === 'employee') && (
									<button
									type='button'
										onClick={() => setShowModal(true)}
										className={`btn d-inline-block bg-danger text-light fw-bold col-md-5 m-4 col-sm-12  `}
									>
										Change Password
									</button>
								)}
									
					</section>
				</form>
			)}
					

				{ShowModal && (
					<ChangePassword show={ShowModal} onHide={() => setShowModal(false)} />
				)}
			</PageContent>
		</React.Fragment>
	);
};

export default UpdateAccountForUsers;
