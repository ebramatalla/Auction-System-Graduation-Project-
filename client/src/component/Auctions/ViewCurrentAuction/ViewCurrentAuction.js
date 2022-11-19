import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import Navbar from '../../HomePage/Header/Navbar';
import classes from './ViewCurrentAuction.module.css';

import AuctionHeader from './AuctionHeader';
import AuctionFooter from './AuctionFooter';

import Slider from '../../UI/Carousel/Carousel';

import useHttp from '../../../CustomHooks/useHttp';
import { getSingleAuction } from '../../../Api/AuctionsApi';
import { io } from 'socket.io-client';
import BiddingDetails from './BiddingDetails';
import { toast } from 'react-toastify';
import ModalUi from '../../UI/Modal/modal';
import NoData from '../../UI/NoData';

import WinnerAudio_ from '../../../assets/Audio/win.mp3'
import EndAuctionAudio_ from '../../../assets/Audio/finished.mp3'



const ViewCurrentAuction = React.memo(() => {
	const location = useLocation();
	const AuctionId = new URLSearchParams(location.search).get('id');
	const role = useSelector(store => store.AuthData.role);
	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn);
	const email = useSelector(store => store.AuthData.email);

	// show all bids when bidder is joined
	const [isShowBids, setIsShowBids] = useState('');
	const [BidderIsJoined, setBidderIsJoined] = useState('');
	// const [BidderIsBid, setBidderIsBid] = useState(true);

	const [socket, setSocket] = useState(null);
	const [roomData, setRoomData] = useState([]);

	const { sendRequest, status, data, error } = useHttp(getSingleAuction);

	// start join auction
	const accessToken = useSelector(store => store.AuthData.idToken);
	const [AuctionEndMessage, setAuctionEndMessage] = useState('');
	const [BidderWinner, setBidderWinner] = useState('');
	const [BidderMessage, setBidderMessage] = useState();
	const [messageToClient, setMessageToClient] = useState('');

	// start audio
	const WinnerAudio = new Audio(WinnerAudio_)
	const EndAuctionAudio = new Audio(EndAuctionAudio_)


	// establish socket connection
	useEffect(() => {
		if (BidderIsJoined && accessToken) {
			setSocket(
				io('http://localhost:8000/auction/bidding', {
					extraHeaders: {
						authorization: `Bearer ${accessToken}`,
					},
				}),
			);
		}
	}, [BidderIsJoined]);

		useEffect(() => {
			if (socket) {
				socket.on('message-to-client', data => {
					setMessageToClient(data.message);
				});
			}
		}, [socket]);


	useEffect(() => {
		if (!!socket && BidderIsJoined && isLoggedIn) {
			socket.on('room-data', data => {
				setRoomData(data);
			});
		}
	}, [BidderIsJoined, !!socket]);

	useEffect(() => {
		if (!!socket) {
			socket.on('auction-ended', data => {
				setAuctionEndMessage(data.message);
				socket.emit('get-winner', {
					auctionId: AuctionId,
				});
				setIsShowBids(false);
				toast.success(data.message);

			});
		}
	}, [!!socket]);

	useEffect(() => {
		if (!!socket) {
			socket.on('winner-bidder', data => {
				setBidderWinner(true);
				if (data.winnerEmail === email) {
					setBidderMessage(data.winnerMessage);
					WinnerAudio.play()

					const time = setTimeout(() => {
						WinnerAudio.pause();
						localStorage.removeItem('BidderIsJoined');
						window.location.reload()

					}, 3000);
					return () => time.clearTimeOut();
				} else {
					setBidderMessage(data.message);
					EndAuctionAudio.play()

					const time = setTimeout(() => {
						EndAuctionAudio.pause();
						window.location.reload()
					}, 4000);
					return () => time.clearTimeOut();
				}


			});
		}
	}, [!!socket]);

	// start new Bidding

	// end join auction

	useEffect(() => {
		sendRequest(AuctionId);
	}, [sendRequest]);

	const AuctionData = data && status === 'completed' && data;
	const ClosedAuction = AuctionData && AuctionData.status === 'closed';
	return (
		<React.Fragment>
			{AuctionData && (
				// show when Auction Data is Found and loaded
				<div className="container-fluid">
					{role !== 'admin' && <Navbar />}
					<Row className={`${classes.ViewCurrentAuction} m-0 p-0 h-100`}>
						<Col lg={5} className={classes.ItemImage}>
							{/* start Bidding Details */}
							{AuctionData &&
								(AuctionData.status === 'ongoing' || AuctionData.status === 'closed') && (
									<BiddingDetails
										roomData= { roomData.auctionDetails ? roomData.auctionDetails : AuctionData }
										isShowBids={isShowBids}
									/>
								)}
							{/* end Bidding Details */}
							<Slider>
								{data &&
									data.item.images.map(image => (
										<img
											src={image.url}
											className="rounded-3"
											alt="itemImage"
											key={image.publicId}
										/>
									))}
							</Slider>
						</Col>

						<Col lg={7} className={classes.Auction}>
							{
								<AuctionHeader
									AuctionData={AuctionData}
									isShownBidsProp={isShowBids}
									BidderIsJoined={BidderIsJoined}
									roomData={roomData ? roomData : AuctionData}
									messageToClient = {messageToClient && messageToClient}
								/>
							}
							{(!ClosedAuction || role==='seller' || !isLoggedIn) && (
								<AuctionFooter
									AuctionStatus={AuctionData && AuctionData.status}
									sellerEmail={AuctionData && AuctionData.seller.email}
									showBids={value => setIsShowBids(value)}
									socket={socket}
									setBidderJoin={value => setBidderIsJoined(value)}
									// setBidderIsBid={value => setBidderIsBid(value)}
									MinimumBidAllowed= { (roomData && roomData.auctionDetails) ?  (roomData.auctionDetails['minimumBidAllowed']) : AuctionData['minimumBidAllowed']}
									chairCost={AuctionData && AuctionData.chairCost}
									AuctionEndMessage={!!AuctionEndMessage}
									RejectionMessage={AuctionData && AuctionData.rejectionMessage}
								/>
							)}
						</Col>
					</Row>

					{/* Modal to Show Bidder-Winner */}
					{BidderWinner && (
						<ModalUi
							show={BidderWinner}
							onHide={() => setBidderWinner(false)}
							title={BidderMessage}
							btn=""
						/>
					)}
				</div>
			)}
			{/* // show when Auction Data is not Found */}
			<NoData text="Auction Not Found " data={AuctionData} error={error} />
		</React.Fragment>
	);
});

export default ViewCurrentAuction;
