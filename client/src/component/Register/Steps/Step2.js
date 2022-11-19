import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { Register, RequestOtp } from '../../../Api/Auth';
import useHttp from '../../../CustomHooks/useHttp';
import { AuthDataActions } from '../../../store/slices/RegisterSlices/AuthData';
import { RegisterActions } from '../../../store/slices/RegisterSlices/Register';
import { AuthActions } from '../../../store/slices/RegisterSlices/userDetails';
import Buttons from '../UI/Prev&NxtButtons/Buttons';
import RadioButton from '../UI/RadioButtons/RadioButton'
import LoadingSpinner from '../../UI/Loading/LoadingSpinner'
import classes from './Steps.module.css';
import VerificationCode from './VerificationCode';


const Step2 = (props) => {
	const phoneNum = useSelector(store => store.userDetails.step2Details.phoneNum);
	const userDetail = useSelector(store => store.userDetails.step1Details)
	const [ShowVerificationCode , setIsShownVerificationCode] =  useState(false)

	// start confirm otp
	const {sendRequest:sendRequestForConfirmPhone  , status:statusForConfirmPhone  , error : errorForConfirmPhone} = useHttp(RequestOtp)
	const {sendRequest:sendRequestForRegister  , status:statusForRegister , data:dataForRegister , error : errorForRegister} = useHttp(Register)

	const [loading , setLoading] = useState(false)
	let isAcceptant;
	const phoneNumRef = useRef();

	const getAcceptantValue = value => {
		isAcceptant = value;
	};

	const dispatch = useDispatch();

	const submitStep2Handler = () =>{
		setLoading(true)
		dispatch(AuthActions.setStep2Details({ phoneNum: `+2${phoneNumRef.current.value}` }))

		const userDetails = {
			name: userDetail.name,
			email: userDetail.email,
			password: userDetail.password,
			role: userDetail.role,
			nationalID: userDetail.nationalID,
			phoneNumber: `+2${phoneNumRef.current.value}`,
		};
		sendRequestForRegister(userDetails);
	};

	// start request otp status
	useEffect(()=>{
		if(statusForRegister === 'completed'){
			setLoading(false)
			toast.success('Register Successfully ❤️‍🔥')

			dispatch(
				AuthDataActions.login({
					idToken: dataForRegister.accessToken,
					email :userDetail.email,
					role: userDetail.role,
				}),
			);

			if (isAcceptant === 'Yes') {
				sendRequestForConfirmPhone(dataForRegister.accessToken)
			}
			else{
				dispatch(RegisterActions.showStep3())
			}
		}
		else if(statusForRegister ==='error'){
			setLoading(false)
			toast.error(errorForRegister)
			const timer = setTimeout(()=>{
				props.hasError(errorForRegister)
				dispatch(RegisterActions.showStep1())
			},2000)
			return () => clearTimeout(timer)
		}
	}, [statusForRegister])


	useEffect(()=>{
		if(statusForConfirmPhone === 'completed'){
			setLoading(false)
			setIsShownVerificationCode(true)
		}
		else if(statusForConfirmPhone === 'error'){
			setLoading(false)
			toast.error(errorForConfirmPhone)
			setIsShownVerificationCode(false)
		}
	}, [statusForConfirmPhone])

	return (
		<React.Fragment>
			<ToastContainer theme="dark" />
			{loading && <LoadingSpinner /> }
		{!ShowVerificationCode ?
			(
			<div className={`container ${classes.Steps} `}>
				<h3> Account Setup</h3>
				<p className={classes['stepParagraph']}>
					This Step to ensure you're a real person by adding a phone number
				</p>

				<div className="input-group my-4">
					<button
						className={` ${classes.btnPhoneNum} btn`}
						type="button"
						id="phoneNum"
					>
						20
					</button>
					<input
						type="text"
						className="form-control"
						placeholder={phoneNum ? phoneNum : ''}
						ref={phoneNumRef}
					/>
				</div>

				{/* start Phone Confirmation */}
				<p className={` ${classes['notification']} `}>
					Use this phone number for Bidding?
				</p>

				<RadioButton
					name="UsePhoneNum"
					values={['Yes', 'No']}
					getValue={getAcceptantValue}
					changeValue={phoneNum ? 'Yes' : 'No'}
				/>
				<Buttons nxt= "Submit" prev="Step1" onClick={submitStep2Handler} />
			</div>
			)
			: (
				<VerificationCode/>
			)
		}
	</React.Fragment>

	);
};

export default Step2;
