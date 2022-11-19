import React, { useEffect, useState } from 'react';
import { StartComponent } from './StartComponent';
import { useSelector } from 'react-redux';
import './reviews.css';
import { DeleteReview, UpdateReviewForSeller } from '../sellerProfileData';
import useHttp from '../../../../CustomHooks/useHttp';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export const AddBuyerReview = props => {
	const nameInputRef = React.useRef();

	const [rateValue, setRateValue] = React.useState('');

	const [inputsDisabled, setInputsDisabled] = useState(true);

	let message = props.data && props.data.message;
	const reviewId = props.data && props.data._id;

	const getRateValue = value => {
		setRateValue(value);
	};
	const idToken = useSelector(store => store.AuthData.idToken);

	const { status, sendRequest, error } = useHttp(UpdateReviewForSeller);
	const {
		status: statusForDelete,
		sendRequest: sendRequestForDelete,
		error: errorForDelete,
	} = useHttp(DeleteReview);

	const switchToEdit = () => {
		setInputsDisabled(!inputsDisabled);
	};

	const updateReview = () => {
		const reviewData = {
			message: nameInputRef.current.value,
			review: rateValue,
		};
		sendRequest({
			idToken: idToken,
			reviewData: reviewData,
			reviewId: reviewId,
		});
	};
	const deleteReview = () => {
		sendRequestForDelete({
			idToken: idToken,
			reviewId: reviewId,
		});
	};

	useEffect(() => {
		if (status === 'completed') {
			toast.success('Your review has been added successfully 💖🐱‍👤');
			props.onReload(Math.random());
		} else {
			toast.error(error);
		}
	}, [status]);
	useEffect(() => {
		if (statusForDelete === 'completed') {
			toast.success('Your review has been deleted successfully 💖🐱‍👤');
			props.onReload(Math.random());
		} else {
			toast.error(errorForDelete);
		}
	}, [statusForDelete]);
	return (
		<>
			<ToastContainer theme="dark" />
			<div className="row">
				<div className=" addContainer d-inline-block position-relative ">
					<div class="form-check form-switch">
						<input
							class="form-check-input"
							type="checkbox"
							id="flexSwitchCheckDefault"
							onClick={switchToEdit}
						/>
						<label
							class="form-check-label text-light"
							for="flexSwitchCheckDefault"
						>
							Switch to edit your review
						</label>
					</div>
					<label className="text-light d-block mt-4 fw-bold fs-6" for="rating">
						Edit your Review
					</label>
					<input
						type="text"
						placeholder={message}
						className="form-control w-50 rate_input d-inline-block"
						ref={nameInputRef}
						disabled={inputsDisabled}
						readOnly={inputsDisabled}
					/>
					<span className="star_con">
						{inputsDisabled && (
							<div className="star_container d-inline-block">
								{[...Array(props.data && props.data.review)].map(() => (
									<FaStar className="star" color="#ffc107" size={20} />
								))}
							</div>
						)}
						{!inputsDisabled && <StartComponent value={getRateValue} />}
					</span>
					<button className="btn btn-primary update_btn" onClick={updateReview}>
						Update Review
					</button>
					<button
						className="btn bg-danger save_rate_btn delete_review"
						onClick={deleteReview}
					>
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
			</div>
		</>
	);
};
