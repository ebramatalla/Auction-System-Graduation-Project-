import React from 'react';
import './reviews.css';

const OverallReviewBar = props => {
	let barFillWidth = '0%';

	if (props.value > 0) {
		// here overall rating
		barFillWidth = Math.round((props.value / 5) * 100) + '%';
	}

	return (
		<div className="chart-bar d-inline-block">
			<div className={`chart-bar__inner ${props.class ? props.class : ''}`}>
				<div className="chart-bar__fill" style={{ width: barFillWidth }}></div>
			</div>
			<div className="chart-bar__label">{props.label}</div>
		</div>
	);
};

export default OverallReviewBar;
