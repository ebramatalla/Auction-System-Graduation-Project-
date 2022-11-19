import React, { useState } from 'react';
import { StartComponent } from './StartComponent';
import { useSelector } from 'react-redux';
import './reviews.css';
import { AddReviewForSeller } from '../sellerProfileData';
import useHttp from '../../../../CustomHooks/useHttp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../Loading/LoadingSpinner';

export const AddReview = props => {
	const nameInputRef = React.useRef();
	const [rateValue, setRateValue] = React.useState('');
	const getRateValue = value => {
		setRateValue(value);
	};
	const idToken = useSelector(store => store.AuthData.idToken);
	const [loading , setLoading] = useState(false)
	const { status, sendRequest, error } = useHttp(AddReviewForSeller);

	const handleSubmit = e => {
		e.preventDefault();
		setLoading(true)	
		const reviewData = {
			message: nameInputRef.current.value,
			review: rateValue,
			seller: props.seller,
		};
		sendRequest({ idToken: idToken, reviewData: reviewData });
	};

	React.useEffect(() => {
		if (status === 'completed') {
			setLoading(false)	
			toast.success('Your review has been added successfully 💖🐱‍👤');
			props.onReload(Math.random());
		} else if(status === 'error') {
			setLoading(false)	
			toast.error(error);
		}
	}, [status]);
	return (
		<>
			<ToastContainer theme="dark" />
			{loading && <LoadingSpinner /> }
			<form className="row" onSubmit={handleSubmit}>
				<div className=" addContainer d-inline-block position-relative ">
					<label className="text-light d-block mt-4 fw-bold fs-6" for="rating">
						Add your Review
					</label>
					<input
						type="text"
						placeholder="Type your review message..."
						className="form-control w-50 rate_input d-inline-block"
						ref={nameInputRef}
					/>
					<span className="star_con">
						<StartComponent value={getRateValue} />
					</span>
					<button className="btn btn-primary save_rate_btn">
						Submit Review
					</button>
				</div>
			</form>
		</>
	);
};
