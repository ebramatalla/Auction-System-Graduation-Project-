import React from 'react';
import classes from './ViewCurrentAuction.module.css';

const BiddingDetails = ({ roomData }) => {
	return (
		<div className={`d-flex justify-content-center`}>
			<div
				className={`${classes.BiddingDetails} ${
					roomData.status === 'closed' ? 'd-none' : 'd-block'
				}`}
			>
				<h6> Minimum Bid Allowed </h6>
				<p> {roomData && roomData['minimumBidAllowed']} </p>
			</div>

			<div className={classes.BiddingDetails}>
				<h6> Current bid Now </h6>
				<p>
					{' '}
					{roomData && roomData['currentBid'] ? roomData['currentBid'] : 0}{' '}
				</p>
			</div>
			{roomData.status === 'closed' && (
				<div className={`${classes.BiddingDetails} bg-danger`}>
					<h6> Winner Bidder </h6>
					<p>
						{' '}
						{roomData.winningBuyer
							? roomData.winningBuyer.name
							: 'no winner in this auction'}{' '}
					</p>
				</div>
			)}
		</div>
	);
};

export default BiddingDetails;
