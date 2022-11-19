import React, { useEffect, useState } from 'react';
import buyerImg from '../../../assets/user.png';
import useHttp from '../../../CustomHooks/useHttp';
import PageHeader from '../Page Header/pageHeader'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import './PageProfile.css'
import { useSelector } from 'react-redux';
import { getUserId, getUserProfile } from '../../../Api/usersApi';
import { ToastContainer } from 'react-toastify';
import ChangePassword from '../ChangePasswordModal/ChangePasswordModal';

const PageProfile = () => {
	const [ShowModal, setShowModal] = useState(false);
	const [UserData, setUserData] = useState({});


	const role = useSelector((store) => store.AuthData.role)
	const idToken = useSelector((store) => store.AuthData.idToken)


	const { data, sendRequest , status } = useHttp(getUserProfile);
	const { data:dataForGetId, sendRequest: sendRequestForGetId , status: statusForGetId} = useHttp(getUserId);


	const [isWarned , setIsWarned] = useState(false)
	const [isWarnedMessage , setIsWarnedMessage] = useState('')

	// start get user id
	useEffect(()=>{
		sendRequestForGetId(idToken)
	},[sendRequestForGetId])

	useEffect(()=>{
		if(statusForGetId === 'completed'){
			setUserData(dataForGetId)
		}
	},[statusForGetId])
	// end user id

	useEffect(() => {
		// sendRequest(props.sellerId);
		//TODO: To be updated
		if(UserData._id){
			const id = UserData._id
			sendRequest({role,id});
		}
	}, [sendRequest , UserData._id]);

	useEffect(()=>{
		if(status === 'completed'){
			if(role === 'seller'){
				setIsWarned(data.seller.isWarned)
				if(data.seller.isWarned){
					setIsWarnedMessage(data.seller.warningMessage)
				}
			}
			if(role === 'buyer'){
				setIsWarned(data.isWarned)
				if(data.isWarned){
					setIsWarnedMessage(data.warningMessage)
				}
			}
		}
	},[status])

	console.log(data && data)

	return (
		<div className='position-relative'>
			<ToastContainer theme="dark"/>
			<PageHeader  text={role==='seller' ? 'Seller Profile' : 'Buyer Profile'} showLink ={false} />
			<div className='profilePageContent position-relative'>
				<img src={(UserData.image && UserData.image.url )? `${UserData['image']['url']}` : buyerImg} alt="ImageDescription" />

			</div>
			<div className='mt-5'>
				<div className='row m-0 p-0'>
					<div className='col-md-6 col-xs-12  mb-4'>
						<h4 className='text-light fw-bold ps-3 pe-3 d-inline-block'> Name : </h4>
						<h6 className='text-secondary d-inline-block fw-bold '> {UserData && UserData.name} </h6>
					</div>
					<div className='col-md-6 col-xs-12  mb-4'>
						<h4 className='text-light fw-bold ps-3 pe-3 d-inline-block'> Email : </h4>
						<h6 className='text-secondary d-inline-block fw-bold '> {UserData && UserData.email} </h6>

					</div>
				</div>

				<div className='row m-0 p-0'>
					{/* address */}
					<div className='col-md-6 col-xs-12  mb-4'>
						<h4 className='text-light fw-bold ps-3 pe-3 d-inline-block'> Address : </h4>
						<h6 className='text-secondary d-inline-block fw-bold '> {(UserData && UserData.address) ?  UserData.address : 'Not Selected' } </h6>

					</div>

					{/* phone number */}
					<div className='col-md-6 col-xs-12  mb-4'>
						<h4 className='text-light fw-bold ps-3 pe-3 d-inline-block'> Phone : </h4>
						<h6 className='text-secondary d-inline-block fw-bold '> {(UserData && UserData.phoneNumber) ?  UserData.phoneNumber : 'Not Selected'} </h6>

					</div>

				</div>

				{/* check if user is warned */}	
				{isWarned && isWarnedMessage &&
					<div className='WarningModal'>
						<span className='text-warning fw-bold  d-inline-block'>
							<FontAwesomeIcon icon={faTriangleExclamation} className="warningIcon"/>
						</span>
						<p className='text-warning d-inline-block fw-bold mb-0 p-3'>   {isWarnedMessage} </p>
					</div>
				}
			</div>

			<div className='d-flex  pt-3 justify-content-center'>
				<Link className={`btn bg-success text-light fw-bold col-md-4 col-xs-12 mx-2 `} to={`${role==='seller' ? '/seller-dashboard/' : '/buyer-dashboard/'}UpdateAccount`} > Update Profile </Link>
				<button className={`btn bg-danger text-light col-md-4 col-xs-12 mx-2 fw-bold `} onClick={()=> setShowModal(true)} > Change Password </button>
			</div>

			{/* show modal of change Password */}
			{ShowModal && (
				<ChangePassword show={ShowModal}  onHide={()=> setShowModal(false)}/>
			)}

		</div>

	);
};
export default PageProfile;
