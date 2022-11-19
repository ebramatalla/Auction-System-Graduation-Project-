import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuctionDetails from './AuctionDetails';
import Bidders from './Bidders';
import Bids from './Bids';

import classes from './ViewCurrentAuction.module.css';

function AuctionHeader({ AuctionData, isShownBidsProp, BidderIsJoined ,  roomData , messageToClient }) {
	const [isShownDetails, setIsShownDetails] = useState(true);
	const [isShownBids, setIsShownBids] = useState(false);
	const [isShownBidders, setIsShownBidders] = useState(false);

	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn)
	const role = useSelector(store => store.AuthData.role)


	const btnDetailsHandler = () => {
		setIsShownDetails(true);
		setIsShownBids(false);
		setIsShownBidders(false);
	};

	const btnBidsHandler = () => {
		setIsShownDetails(false);
		setIsShownBids(true);
		setIsShownBidders(false);
	};

	const btnBiddersHandler = () => {
		setIsShownBidders(true);
		setIsShownDetails(false);
		setIsShownBids(false);
	};

	// start show bid when bidder joined in auction and want to bid
	useEffect(() => {
		if (isShownBidsProp) {
			btnBidsHandler();
		} else {
			btnDetailsHandler();
		}
	}, [isShownBidsProp]);
	// end show bid when bidder joined in auction and want to bid

	return (
		<Fragment>
			<div className={classes.AuctionHeader}>
				{/* start with auction header */}
				<button
					className={`btn ${
						isShownDetails && !isShownBids ? classes.ActiveLink : ''
					}`}
					onClick={btnDetailsHandler}
				>
					Details
				</button>

				<button
					className={`btn  ${isShownBids ? classes.ActiveLink : ''} ${
						classes.showBidsBtn
					}`}
					onClick={btnBidsHandler}
					disabled={(AuctionData && AuctionData['status']) === 'upcoming'}
				>
					<span className="position-relative"> Bids </span>
					<span className={classes.numOfBids}>
						{' '}
						{roomData && roomData.bids
							? roomData.bids.length
							: AuctionData && AuctionData.numOfBids
							? AuctionData.numOfBids
							: 0}{' '}
					</span>
				</button>

				<button
					className={`btn  ${isShownBidders ? classes.ActiveLink : ''} ${
						classes.showBiddersBtn
					}`}
					onClick={btnBiddersHandler}
					disabled={(AuctionData && AuctionData['status']) === 'upcoming'}
				>
					<span className="position-relative"> Bidders </span>
					<span className={classes.numOfBids}>
						{' '}
						{roomData && roomData.bidders
							? roomData.bidders.length
							: AuctionData && AuctionData.bidders
							? AuctionData.bidders.length
							: 0}{' '}
					</span>
				</button>
			</div>
			{/* end with auction header */}

			{(isShownDetails && (roomData || AuctionData) ) &&
				<AuctionDetails
					// data= {((!isLoggedIn || role!=='buyer') && !roomData ) ? (AuctionData && AuctionData) : ( roomData && roomData.auctionDetails) }
					data = {AuctionData && AuctionData}
					// roomData = {(roomData && roomData) ? roomData : AuctionData}

				/>
			}
			{isShownBids && (
				<Bids
					// roomData = {(roomData && roomData)  ? roomData : AuctionData}
					messageToClient = {messageToClient && messageToClient}
					roomData ={
						(AuctionData && AuctionData['status'] !== 'ongoing' || (!BidderIsJoined && role==='buyer')) ? AuctionData :
						((AuctionData && AuctionData['status'] === 'ongoing' && AuctionData['status'] !== 'upcoming' && ( !isLoggedIn || role !== 'buyer') ) ? AuctionData : ((roomData && roomData) ? roomData : AuctionData) )
					}

				/>
			)}
			{isShownBidders && (
				<Bidders
					// roomData={
					// 	AuctionData && AuctionData['status'] !== 'ongoing'
					// 		? AuctionData
					// 		: roomData
					// }
					roomData ={
						(AuctionData && AuctionData['status'] !== 'ongoing' || (!BidderIsJoined && role==='buyer')) ? AuctionData :
						((AuctionData && AuctionData['status'] === 'ongoing' && AuctionData['status'] !== 'upcoming' && ( !isLoggedIn || role !== 'buyer') ) ? AuctionData : ((roomData && roomData) ? roomData : AuctionData) )
					}
				/>
			)}
		</Fragment>
	);
}

export default AuctionHeader;
