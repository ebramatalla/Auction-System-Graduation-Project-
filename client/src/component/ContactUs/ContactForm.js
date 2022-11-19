import React, { useRef, useState } from 'react';
import Input from '../UI/Input/input';

// import style of Contact us
import classes from './ContactForm.module.css';

const ContactForm = props => {
	const nameRef = useRef();
	const EmailRef = useRef();

	const [Messagevalue, setMessagevalue] = useState('');
	const [isTouched, setIsTouched] = useState(false);

	const validateText = value => value.trim() !== '';
	const validateEmail = value => value.trim().includes('@');

	const isValid = validateText(Messagevalue);
	const hasError = isTouched && !isValid;

	let errorNameMessage = 'Please Enter Your Name';
	let errorEmailMessage = 'Please Enter Your Email';
	let errorMessage = 'Please Enter Your Complaint  ';

	const textAreaChangeHandler = e => {
		setMessagevalue(e.target.value);
	};
	const textAreaBlurHandler = e => {
		setIsTouched(true);
	};

	const submitHandler = e => {
		e.preventDefault();
		const values = {
			name: nameRef.current.value,
			email: EmailRef.current.value,
			message: Messagevalue,
		};
		let isValid = true;
		if (
			validateEmail(EmailRef.current.value) &&
			validateText(nameRef.current.value) &&
			validateText(Messagevalue)
		) {
			isValid = true;
		} else {
			isValid = false;
		}
		props.SendComplaint(isValid ? values : null);

	};
	const FormControlStyle = `form-control ${classes['formControl']}`;

	return (
		<React.Fragment>
			<div className={` ${classes.ContactForm} p-0`}>
				<h2 className="text-center fw-bold">
					{' '}
					<span className={classes.AnotherWay}> Or Submit </span> A Complaint
				</h2>
				{/* start contact form */}
				<form className={classes.ContactFormDetails}>
					<div className="d-flex flex-column w-100">
						<label className="pb-1"> Name </label>
						<Input
							type="text"
							name="text"
							validateText={validateText}
							ref={nameRef}
							errorMassage={errorNameMessage}
						/>
					</div>

					<div className="d-flex flex-column w-100">
						<label className="pb-1"> Email </label>
						<Input
							type="email"
							name="email"
							validateText={validateEmail}
							ref={EmailRef}
							errorMassage={errorEmailMessage}
						/>
					</div>

					<div className="d-flex flex-column w-100">
						<label className="pb-1"> Message </label>
						<textarea
							className={`${FormControlStyle} `}
							onChange={textAreaChangeHandler}
							onBlur={textAreaBlurHandler}
							value={Messagevalue}
						></textarea>
						{hasError && (
							<p className={classes.textAreaError}> {errorMessage} </p>
						)}
					</div>
					<button className={`${classes.btnSubmit} `} onClick={submitHandler}>
						{' '}
						Submit{' '}
					</button>
				</form>

				{/* end contact form */}
			</div>
		</React.Fragment>
	);
};

export default ContactForm;
