import React from 'react';
import { useSelector } from 'react-redux';
import './reviews.css';
import { FaStar } from 'react-icons/fa';
import { AddReview } from './AddReview';
import moment from 'moment';
import { getBuyerReview } from '../sellerProfileData';
import useHttp from '../../../../CustomHooks/useHttp';
import { AddBuyerReview } from './AddBuyerReview';

const Reviews = props => {
	const role = useSelector(store => store.AuthData.role);
	const idToken = useSelector(store => store.AuthData.idToken);
	const { data, sendRequest, error } = useHttp(getBuyerReview);
	const sellerId = props.seller._id;

	// ! Check if buyer has already review this seller if has get it
	React.useEffect(() => {
		sendRequest({ sellerId: sellerId, idToken });
	}, [sendRequest, props.reload]);

	// ! rendering
	return (
		<>
			{role === 'buyer' && error && (
				<AddReview
					onReload={value => props.onReload(value)}
					seller={props.seller._id}
				/>
			)}
			{role === 'buyer' && !error && (
				<AddBuyerReview
					onReload={value => props.onReload(value)}
					data={data && data}
				/>
			)}
			<div className="card_container_Profile">
				<h2 className="text-light text-center mt-4 fw-bold reviews_list">
					Recent Reviews
				</h2>

				{props.reviews.length !== 0 ? (
					props.reviews.map((review, index) => {
						const date = moment().from(review.createdAt);
						return (
							<>
								<div className="reviews_card">
									<h6 className="text-light fw-bold cardDate">{date}</h6>
									<h5 className="text-light me-4 fw-bold d-inline-block">
										{review.buyer && review.buyer.name} :{' '}
									</h5>
									<p className="text-light me-4 d-inline-block">
										{review.message}
									</p>
									<div className="star_container d-inline-block">
										{[...Array(review.review)].map(() => (
											<FaStar className="star" color="#ffc107" size={20} />
										))}
									</div>
								</div>
							</>
						);
					})
				) : (
					<h2 className="text-danger text-center mt-4 fw-bold ">
					No Reviews Right Now
					</h2>
				)}
			</div>
		</>
	);
};
export default Reviews;
