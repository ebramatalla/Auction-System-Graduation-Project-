import React from 'react';
import ViewAuctionDetails from '../../ViewAuctionDetails/ViewAuctionDetails';
import '../profile.css';
import '../Reviews/reviews.css';
const Auctions = props => {
	return (
		<section className="profile_content">
			<div className="profile_table ">
				<h2 className="text-light text-center mt-4 fw-bold reviews_list ">
					Seller Auctions
				</h2>
				<div className="mb-0">
					{' '}
					{props.auctionsData.length !== 0 ? (
						<ViewAuctionDetails AuctionData={props.auctionsData} lg={4} />
					) : (
						<h2 className="text-danger text-center mt-4 fw-bold  ">
							No Auctions Right Now
						</h2>
					)}
				</div>
			</div>
		</section>
	);
};
export default Auctions;
