import React, { useEffect, useRef } from 'react';
import classes from './Steps.module.css';
import verifyClasses from './step4.module.css';

import styles from '../UI/Prev&NxtButtons/Buttons.module.css';
import {useSelector } from 'react-redux';

import useInput from '../../../CustomHooks/useInput';
import useHttp from '../../../CustomHooks/useHttp';
import { resendConfirmation, sendConfirmation } from '../../../Api/Auth';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Step3 = () => {
	const role = useSelector(store=>store.AuthData.role)
	const codeNum1ref = useRef();
	const codeNum2ref = useRef();
	const codeNum3ref = useRef();
	const codeNum4ref = useRef();
	const codeNum5ref = useRef();

	const { hasError, onChangeValueHandler, onBlurHandler } = useInput(
		value => value.trim().length === 1,
	);
	const idToken = useSelector(store=> store.AuthData.idToken)
	const email = useSelector(store=> store.userDetails.step1Details.email)
	const {sendRequest , status , data , error} = useHttp(sendConfirmation)
	const {sendRequest:sendRequestForResend , status:statusForResend , data:dataForResend , error:errorForResend} = useHttp(resendConfirmation)
	const navigate = useNavigate()

	const ContactDetails = [
		codeNum1ref,
		codeNum2ref,
		codeNum3ref,
		codeNum4ref,
		codeNum5ref,
	].map((item, index) => (
		<input
			key={index}
			type="number"
			className={`${verifyClasses.code} ${hasError ? classes['alarm-input'] : ''}`}
			min="0"
			max="9"
			required
			ref={item}
			onChange={onChangeValueHandler}
			onBlur={onBlurHandler}
		/>
	));

	// start confirm otp status
	useEffect(()=>{
		if(status === 'completed'){
			toast.success(data.message)
			const timer = setTimeout(()=>{
				if (role === 'buyer') {
					navigate('/buyer-dashboard');
				} else if (role === 'seller') {
					navigate('/seller-dashboard');
				}
			},4000)
			return () => clearTimeout(timer)
		}
		else if(status ==='error'){
			toast.error(error)
		}
	}, [status])


	const ResendHandler = () => {
		codeNum1ref.current.value = ''
		codeNum2ref.current.value = ''
		codeNum3ref.current.value = ''
		codeNum4ref.current.value = ''
		codeNum5ref.current.value = ''
		sendRequestForResend(email)
	};


	// start confirm otp status
	useEffect(()=>{
		if(statusForResend === 'completed'){
			toast.success(dataForResend.message)
		}
		else if(statusForResend ==='error'){
			toast.error(errorForResend)
		}
	}, [statusForResend])


	const SubmitHandler = e => {
		e.preventDefault()
		const verificationCode =
			codeNum1ref.current.value +
			codeNum2ref.current.value +
			codeNum3ref.current.value +
			codeNum4ref.current.value +
			codeNum5ref.current.value;
		if (verificationCode) {
			// confirm request
			sendRequest({idToken , verificationCode , email})
		}
	};

	return (
		<div className={`container ${classes.Steps} text-center `}>
			<ToastContainer theme='dark' />
			<h3>Verification</h3>
			<p className={classes['stepParagraph']}>
				We’ve just sent a text message with a fresh verification code to your email {email}
			</p>

			<div className={verifyClasses['code-container']}>{ContactDetails}</div>

			<div className={styles['btn-steps']}>
				<button
					type="button"
					onClick={ResendHandler}
					className={`btn btn-secondary ${styles.btnStep}`}
				>
					Re-Send
				</button>
				<button
					type="button"
					onClick={SubmitHandler}
					className={`btn mx-2 text-light ${styles.btnStep}`}
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default Step3;
