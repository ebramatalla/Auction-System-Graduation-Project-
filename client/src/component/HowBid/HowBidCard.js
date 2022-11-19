import React, { Fragment } from 'react';
import classes from './HowBidCard.module.css';

const HowBidCard = props => {
	return (
		<Fragment>
			<div
				className={`${props.className ? props.className : ''} container ${
					classes['steps-content']
				} `}
			>
				{props.children}
			</div>
		</Fragment>
	);
};

export default HowBidCard;
