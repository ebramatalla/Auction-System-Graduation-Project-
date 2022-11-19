import React, {useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RegisterActions } from '../../../store/slices/RegisterSlices/Register';
import { AuthActions } from '../../../store/slices/RegisterSlices/userDetails';

import RadioButton from '../UI/RadioButtons/RadioButton';
import Input from '../../UI/Input/input';
import classes from './Steps.module.css';

const Step1 = props => {
	const [isValidForm, setIsValidForm] = useState(true);

	const userDetails = useSelector(store => store.userDetails.step1Details);
	const dispatch = useDispatch();

	/************  start Validation  ************** */

	// to check [password] with [check password]
	let password = '';
	let roleValue = '';
	let errorNameMessage = 'Please Enter Your Name';
	let errorEmailMessage = 'Please Enter Your Email';

	const nameRef = useRef();
	const passwordRef = useRef();
	const emailRef = useRef();
	const confirmPasswordRef = useRef();
	const nationalIdRef = useRef()

	const validateText = value => value.trim() !== '';
	const validateEmail = value => value.trim().includes('@');
	const validatePassword = value => value.trim().length > 4;
	const validateConfirm = value => value.trim() === password;
	const validateNationalId = value => value.trim().length >= 14;


	const getPasswordValue = value => {
		password = value;
	};
	const getRoleValue = value => {
		roleValue = value;
	};
	/************  end Validation  ************** */

	// useEffect(() => {
	// 	if (status === 'completed') {
	// 		dispatch(
	// 			AuthActions.setStep1Details({
	// 				name: nameRef.current.value,
	// 				email: emailRef.current.value,
	// 				password: passwordRef.current.value,
	// 				role: roleValue,
	// 			}),
	// 		);
	// 		dispatch(
	// 			AuthDataActions.login({
	// 				idToken: data.accessToken,
	// 				email: emailRef.current.value,
	// 				role: data.role,
	// 			}),
	// 		);
	// 		dispatch(RegisterActions.showStep2());
	// 	}
	// }, [status]);

	const ValidateForm = () => {
		if (
			validateText(nameRef.current.value) &&
			validateEmail(emailRef.current.value) &&
			validatePassword(passwordRef.current.value) &&
			validateConfirm(confirmPasswordRef.current.value) &&
			validateNationalId(nationalIdRef.current.value) &&
			roleValue
		) {
			dispatch(
				AuthActions.setStep1Details({
					name: nameRef.current.value,
					email: emailRef.current.value,
					password: passwordRef.current.value,
					nationalID: nationalIdRef.current.value,
					role: roleValue,
				}),
			);

			dispatch(RegisterActions.showStep2());

		} else {
			setIsValidForm(false);
		}
	};

	const submitHandler = e => {
		e.preventDefault();
		ValidateForm();
	};

	return (
		<div className={`container ${classes.Steps} `}>
			<h3> Personal Information</h3>
			{props.hasError && <h6 className='text-danger pt-2 fw-bold text-center'> {props.hasError} </h6> }
			{!isValidForm && (
				<h6 className={`${classes['alert']} pb-3 pt-0 text-center `}>
					{' '}
					Please Enter the Required Information{' '}
				</h6>
			)}
			<Input
				type="text"
				placeholder='Name'
				id="name"
				name="text"
				validateText={validateText}
				value = {userDetails.name ? userDetails.name : ''}
				ref={nameRef}
				errorMassage={errorNameMessage}
			/>
			<Input
				type="email"
				id="email"
				placeholder='Email'
				value={userDetails.email ? userDetails.email : ''}

				name="email"
				validateText={validateEmail}
				ref={emailRef}
				errorMassage={errorEmailMessage}
			/>
			<Input
				type="password"
				placeholder="Password"
				id="Password"
				name="password"
				validateText={validatePassword}
				ref={passwordRef}
				errorMassage="Your password must be more than 8 characters "
				getValue={getPasswordValue}
			/>
			<Input
				type="password"
				id="ConfirmPassword"
				placeholder="Confirm Password"
				name="confirmPassword"
				validateText={validateConfirm}
				ref={confirmPasswordRef}
				errorMassage="Your confirm password must match with password "
			/>

			{/* start National id */}
			<Input
				type="number"
				placeholder='National Id'
				value = {userDetails.nationalID ? userDetails.nationalID : 'National Id'}
				ref={nationalIdRef}
				errorMassage="National ID must be longer than or equal to 14 characters"
				validateText={validateNationalId}

			/>

			<div>
				<p className="text-light m-1 mb-0 fs-6 fw-bolder"> Choose Your Role </p>
				<RadioButton
					name="role"
					values={['seller', 'buyer']}
					getValue={getRoleValue}
					changeValue={userDetails.role ? userDetails.role : ''}
				/>
			</div>



			<button
				onClick={submitHandler}
				className={`${classes['btn-next']} btn w-75 `}
				type="button"
			>
				{' '}
				Next{' '}
			</button>
		</div>
	);
};

export default Step1;
