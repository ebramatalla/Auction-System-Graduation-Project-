import React, { useEffect, useRef } from 'react';
import classes from './Steps.module.css';
import VerificationStyle from './step4.module.css';

import styles from '../UI/Prev&NxtButtons/Buttons.module.css';
import { useDispatch, useSelector } from 'react-redux';

import useInput from '../../../CustomHooks/useInput';
import { ConfirmOtp } from '../../../Api/Auth';
import useHttp from '../../../CustomHooks/useHttp';

import {toast} from 'react-toastify'
import { RegisterActions } from '../../../store/slices/RegisterSlices/Register';


const VerificationCode = () => {

	// start confirm otp
	const {sendRequest  , status , data , error} = useHttp(ConfirmOtp)

	const phoneNumber = useSelector(
		store => store.userDetails.step2Details.phoneNum,
	);
	const idToken = useSelector(
		store => store.AuthData.idToken,
	);

	const lastFourDigits = phoneNumber.substring(6);

	const codeNum1ref = useRef();
	const codeNum2ref = useRef();
	const codeNum3ref = useRef();
	const codeNum4ref = useRef();
	const codeNum5ref = useRef();
	const codeNum6ref = useRef();

	const { hasError, onChangeValueHandler, onBlurHandler } = useInput(
		value => value.trim().length === 1,
	);

	const ContactDetails = [
		codeNum1ref,
		codeNum2ref,
		codeNum3ref,
		codeNum4ref,
		codeNum5ref,
		codeNum6ref,
	].map((item, index) => (
		<input
			key={index}
			type="number"
			className={`${VerificationStyle.code} ${hasError ? classes['alarm-input'] : ''}`}
			min="0"
			max="9"
			required
			ref={item}
			onChange={onChangeValueHandler}
			onBlur={onBlurHandler}
		/>
	));


	const dispatch = useDispatch();

	const SubmitHandler = e => {
		e.preventDefault();
		const verificationCode =
			codeNum1ref.current.value +
			codeNum2ref.current.value +
			codeNum3ref.current.value +
			codeNum4ref.current.value +
			codeNum5ref.current.value +
			codeNum6ref.current.value;
		if (verificationCode) {
			// confirm request
			sendRequest({idToken , verificationCode})
		}
	};

	// start confirm otp status
	useEffect(()=>{
		if(status === 'completed'){
			toast.success(data.message)
			dispatch(RegisterActions.showStep3())
		}
		else if(status ==='error'){
			toast.error(error)
			codeNum1ref.current.value = ''
			codeNum2ref.current.value = ''
			codeNum3ref.current.value = ''
			codeNum4ref.current.value = ''
			codeNum5ref.current.value = ''
			codeNum6ref.current.value = ''
		}
	}, [status])


	return (
		<div className={`container ${classes.Steps} text-center `}>
			<h3>Verification For PhoneNumber </h3>

			<p className={classes['stepParagraph']}>
				We’ve just sent a text message with a fresh verification code to the
				phone number *******{lastFourDigits}.
			</p>

			<div className={VerificationStyle['code-container']}>{ContactDetails}</div>

			<div className={styles['btn-steps']}>
				<button
					type="button"
					onClick={SubmitHandler}
					className={`btn text-light ${classes.btnSubmit}`}
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default VerificationCode;
