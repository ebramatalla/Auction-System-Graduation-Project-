import React, { useState } from 'react';
import './reviews.css';
import { FaStar } from 'react-icons/fa';

export const StartComponent = props => {
	const [rating, setRating] = useState(null);
	const [hover, setHover] = useState(null);

	props.value(rating);
	return (
		<>
			{[...Array(5)].map((rate, i) => {
				const ratingValue = i + 1;

				return (
					<label>
						<input
							type="radio"
							name="rating"
							className="d-none"
							value={ratingValue}
							onClick={() => setRating(ratingValue)}
						/>
						<FaStar
							className="star"
							onMouseEnter={() => setHover(ratingValue)}
							onMouseLeave={() => setHover(null)}
							color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
							size={20}
						/>
					</label>
				);
			})}
		</>
	);
};
