import React, { useRef, useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import usePaymentForm from './usePaymentForm.js';

import { ToastContainer, toast } from 'react-toastify';
import Input from '../../../../UI/Input/input';

import './PaymentForm.css';
import LoadingSpinner from '../../../../UI/Loading/LoadingSpinner.js';
import RecoverMoney from '../RecoverMoney.js';

const PaymentForm = props => {
	// Get the handle submit method
	const AmountRef = useRef();
	const [AmountErrorMessage, setAmountErrorMessage] = useState(
		'Charge amount must be more than 100 USD',
	);
	const { handleSubmit, PaymentIntentId, Loading } = usePaymentForm(
		props.onReload,
	);

	const [showRecoverModal, setShowRecoverModal] = useState(false);

	// start validate Amount num [Amount must be less than 100]
	const validateAmount = value => value.trim().length !== 0 && value > 100;

	const handleSubmitValidation = e => {
		e.preventDefault();
		if (validateAmount(AmountRef.current.value)) {
				handleSubmit(e, AmountRef.current.value);
		} else {
			setAmountErrorMessage("Amount must'nt be less than 100 ❌");
			toast.error(
				'Please Fill All Details Required For Charge Your Wallet ❌ ',
			);
		}
	};

	//* Return the form that responsible for payment
	return (
		<>
			<ToastContainer />
			{Loading && <LoadingSpinner />}
			<form
				onSubmit={handleSubmitValidation}
				id="payment-form"
				className={props.className ? props.className : ''}
			>
				{/* start cardElement */}
				<label htmlFor="card-element" className="fw-bold fs-5 text-light">
					Card Details
				</label>
				<CardElement
					id="card-element"
					className="form-control my-2 mb-0 paymentInput"
				/>
				{/* end cardElement */}

				{/* start amount */}
				<label className="text-light fs-5 mt-4 mb-2 fw-bold"> Amount </label>
				<Input
					type="number"
					validateText={validateAmount}
					errorMassage={AmountErrorMessage}
					id="productPrice"
					className="chargeAmountStyle "
					ref={AmountRef}
				/>
				{/* end amount */}

				{/* Charge Wallet Now 💲 */}
				<button
					type="submit"
					className={`btn paymentBtn btn-success  ${
						props.className
							? 'col-md-4 col-sm-12 chargeWalletBtn bg-primary float-end'
							: 'float-left btn-success col-sm-12'
					} `}
				>
					Charge Wallet Now
				</button>
			</form>

			{showRecoverModal && (
				<RecoverMoney
					PaymentIntentId={PaymentIntentId}
					show={showRecoverModal}
					onHide={() => setShowRecoverModal(false)}
					onReload={props.onReload}
				/>
			)}
		</>
	);
};

export default PaymentForm;
