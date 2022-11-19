import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getProfileData, getSingleAuction } from '../../../Api/Admin';
import { DeleteAuctionHandler } from '../../../Api/AuctionsApi';
import ModalUi from './BiddingForm/Modal';
import useHttp from '../../../CustomHooks/useHttp';

import classes from './ViewCurrentAuction.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckIfAuctionSaved, getJoinedAuctions, joinAuctionApi } from '../../../Api/BuyerApi';
import LoadingSpinner from '../../UI/Loading/LoadingSpinner'


// start audio url
import StartAuctionAudio_ from '../../../assets/Audio/start.mp3'
import EndAuctionAudio_ from '../../../assets/Audio/finished.mp3'
import NewBidAudio_ from '../../../assets/Audio/add-new-bid.mp3'

function AuctionFooter({
	AuctionStatus,
	sellerEmail,
	RejectionMessage,
	showBids,
	socket,
	setBidderJoin,
	MinimumBidAllowed,
	chairCost,
	AuctionEndMessage,
}) {
	const [loading , setLoading] = useState(false)

	const location = useLocation();
	const navigate = useNavigate();
	const AuctionId = new URLSearchParams(location.search).get('id');
	const accessToken = useSelector(store => store.AuthData.idToken);
	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn)
	const [modalShow, setModalShow] = useState(false);
	const [btnSavedValue, setBtnSavedValue] = useState('Save Auction');
	const [RetreatModalTitle, setRetreatModalTitle] = useState('');

	// start sounds
	const StartAuctionAudio = new Audio(StartAuctionAudio_)
	const NewBidAudio = new Audio(NewBidAudio_)
	const EndAuctionAudio = new Audio(EndAuctionAudio_)

	// end sounds


	const role = useSelector(store => store.AuthData.role);
	const url = 'http://localhost:8000';
	const email = useSelector(store => store.AuthData.email);

	// set true when bidder is joined in auction
	const [isJoined, setIsJoined] = useState(
		localStorage.getItem('BidderIsJoined'),
	);

	// confirmation join auction
	const [ConfirmJoin, setConfirmJoin] = useState('');
	const [BidNow, setBidsNow] = useState(false);

	const [
		isExistErrorWhenJoinAuction,
		setIsExistErrorWhenJoinAuction,
	] = useState(false);

	// extend Auction Time In Seller
	const [ExtendAuctionId, setExtendAuctionId] = useState('');

	const UpComingStatus = AuctionStatus === 'upcoming';
	const OnGoingStatus = AuctionStatus === 'ongoing';
	const PendingStatus = AuctionStatus === 'pending';
	const DeniedStatus = AuctionStatus === 'denied';
	const idToken = useSelector(store => store.AuthData.idToken);


	// check if Buyer Joined in this auction or not
	const { sendRequest : sendRequestForJoinedAuctions, status:statusForJoinedAuctions, data:dataForJoinedAuctions } = useHttp(getJoinedAuctions);
	const { data: dataForProfile, sendRequest: sendRequestForProfile, status: statusForProfile} = useHttp(getProfileData);
	useEffect(() => {
		sendRequestForProfile(idToken);
	}, [sendRequestForProfile , AuctionId]);

	useEffect(() => {
		const buyerId = dataForProfile && dataForProfile._id;
		if (statusForProfile === 'completed') {
			sendRequestForJoinedAuctions({ idToken, buyerId: buyerId && buyerId });
		}
	}, [sendRequestForJoinedAuctions, statusForProfile]);

	useEffect(()=> {
		if(statusForJoinedAuctions==='completed'){
			const joinedAuctions = dataForJoinedAuctions && [...dataForJoinedAuctions.joinedAuctions]
			console.log(joinedAuctions.filter((data)=> data._id === AuctionId && data.status) )
			const checkIfJoined = joinedAuctions.length > 0 && joinedAuctions.filter((data)=> data._id === AuctionId && data.status)

			if( checkIfJoined && checkIfJoined.length > 0  ) {
				if(!localStorage.getItem('BidderIsJoined')){
					localStorage.setItem('BidderIsJoined' , true)
					setIsJoined(true)
					setBidderJoin(true)
					window.location.reload()

					StartAuctionAudio.play()
					const timer = setTimeout(()=>{
					StartAuctionAudio.pause();
						window.location.reload()

					},2000)
					return ()=> clearTimeout(timer)
				}
			}
			else{
				localStorage.removeItem('BidderIsJoined')
				setIsJoined(false)
				setBidderJoin(false)
			}
		}

	},[statusForJoinedAuctions])
	// check if Buyer Joined in this auction or not


	// handle Rejection
	const { sendRequest, status } = useHttp(getSingleAuction);
	const {
		sendRequest: sendRequestForJoinAuction,
		status: statusForJoinAuction,
		data: dataForJoinAuction,
		error: errorForJoinAuction,
	} = useHttp(joinAuctionApi);

	// start save auction api
	const {
		sendRequest: sendRequestForIfSavedAuction,
		status: statusForIfSavedAuction
	} = useHttp(CheckIfAuctionSaved);

	useEffect(() => {
		if (UpComingStatus && role === 'buyer' && AuctionId) {
			const idToken = accessToken;
			const id = AuctionId;
			sendRequestForIfSavedAuction({ idToken, id });
		}
	}, [sendRequestForIfSavedAuction, UpComingStatus, role, AuctionId]);

	useEffect(() => {
		if (statusForIfSavedAuction === 'completed') {
			setBtnSavedValue('Saved');
		}
	}, [statusForIfSavedAuction]);

	useEffect(() => {
		if (statusForIfSavedAuction === 'error') {
			setBtnSavedValue('Save Auction');
		}
	}, [statusForIfSavedAuction]);

	const btnSaved = btnSavedValue => {
		setBtnSavedValue(btnSavedValue);
	};

	// end check if upcoming auction saved or not

	// handle delete
	const {
		sendRequest: sendRequestForDelete,
		status: statusForDelete,
		error: errorForDelete,
	} = useHttp(DeleteAuctionHandler);


	useEffect(() => {
		if (status === 'completed') {
			sendRequest({ AuctionId: AuctionId, idToken: accessToken });
		}
	}, [sendRequest]);

	const approveHandler = () => {
		setLoading(true)
		fetch(`${url}/admin/auction/approve/${AuctionId}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'content-type': 'application/json',
			},
		}).then(res => {
			if (!res.ok) {
				setLoading(false)
			} else {
				setLoading(false)
				toast.success('Approved Successfully');
				navigate('/');
			}
		});
	};

	const rejectHandler = async (rejectMassage) => {
		setLoading(true)
		const rejectionMessage = { message: rejectMassage };
		const response = await fetch(`${url}/admin/auction/reject/${AuctionId}`, {
			method: 'POST',
			body: JSON.stringify(rejectionMessage),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'content-type': 'application/json',
			},
		})
			const data = await response.json()
			if (!response.ok || data.success === false) {
				setLoading(false)
				toast.error(data.message)
			}
			else{
				setLoading(false)
				toast.success(data.message)
				const timer = setTimeout(()=>{
					window.location.reload()
				},3000)
				return ()=> clearTimeout(timer)
			}

			setModalShow(false);
		}


	// start join auction handler
	const joinAuctionHandler = OnGoingStatus => {
		if (OnGoingStatus && !isJoined) {
			console.log('join' )
			setModalShow(true);
			setConfirmJoin(Math.random());

		}
		// start to place bid
		if (isJoined && OnGoingStatus) {
			console.log('bid')
			setRetreatModalTitle('');
			setConfirmJoin('');

			setBidderJoin(true)
			setBidsNow(true);
			setModalShow(true);
		} else {
			setModalShow(true);
		}
	};
		// start join
		useEffect(() => {
			if (statusForJoinAuction === 'completed') {
				setLoading(false)
				if (role === 'buyer') {
					setConfirmJoin('');
					setModalShow(false);
					toast.success(dataForJoinAuction.message);
					localStorage.setItem('BidderIsJoined', dataForJoinAuction.success);

					setIsJoined(localStorage.getItem('BidderIsJoined'));
					setBidderJoin(localStorage.getItem('BidderIsJoined'))
					showBids(Math.random());

					StartAuctionAudio.play()
					const timer = setTimeout(()=>{
					StartAuctionAudio.pause();
						window.location.reload()

					},2000)
					return ()=> clearTimeout(timer)
				} else {
					localStorage.removeItem('BidderIsJoined');
					setIsJoined(false);
				}
			}
			if (statusForJoinAuction === 'error') {
				setLoading(false)
				toast.error(errorForJoinAuction);
				localStorage.removeItem('BidderIsJoined');
				setIsJoined(false);
			}
		}, [statusForJoinAuction]);

	// start leave auction
	const LeaveAuctionHandler = () => {
		setBidsNow(false);
		setModalShow(true);
		setRetreatModalTitle(
			'Are You Sure You Want To RetreatFrom This Auction ? ',
		);
	};

	const RetreatModelHandler = () => {
		setLoading(true)
		socket.emit('leave-auction', {
			auctionId: AuctionId,
		});
		localStorage.removeItem('BidderIsJoined');
		setIsJoined(false);

		socket.on('exception', data => {
			localStorage.setItem('BidderIsJoined', true);
			setIsJoined(true);

			setIsExistErrorWhenJoinAuction(data.message);
			setModalShow(true);
		});

		setModalShow(false);
		setLoading(false)
		setRetreatModalTitle('');
	};



	// if bidder accept block money from your wallet
	const btnConfirmationHandler = () => {
		setLoading(true)
		// start send request to join auction
		const idToken = accessToken;
		const id = AuctionId;
		sendRequestForJoinAuction({ idToken, id });
	};

	useEffect(() => {
		if (isJoined && role === 'buyer' && OnGoingStatus) {
			setBidderJoin(true)
			showBids(Math.random());
		}
	}, [isJoined , role , OnGoingStatus]);



	// start get bidding amount from modal and send to bid
	const btnBiddingHandler = value => {
		setLoading(true)
		setBidderJoin(true)
		socket.emit('place-bid', {
			auctionId: AuctionId,
			bidValue: value,
		});

		// view exception error in modal
		socket.on('exception', data => {
			setLoading(false)
			setIsExistErrorWhenJoinAuction(data.message);
			setModalShow(true);
			const time = setTimeout(() => {
				setIsExistErrorWhenJoinAuction('');
				if (modalShow) {
					window.location.reload()
					setModalShow(false);
				}
			}, [3000]);
			return () => clearTimeout(time)
		});


	};

	// start new Bid Listener
	useEffect(() => {
		if (socket) {
			socket.on('new-bid', data_ => {
				setLoading(false)
				setModalShow(false);
				setBidderJoin(true);
				toast.success('new Bid is Adding Successfully ❤️‍🔥 ');
				NewBidAudio.play()
				const timer = setTimeout(()=>{
					NewBidAudio.pause();
				},3000)

				return ()=> clearTimeout(timer)
			});
		}

	}, [socket]);

	// end new Bid Listener
	// end join auction handler

	//  ************************  end Bidding Handler ****************************
	// start seller Handler
	// ! to be handled
	const DeleteAuction = AuctionId => {
		sendRequestForDelete({ AuctionId: AuctionId, accessToken });

		if (statusForDelete === 'completed') {
			setModalShow(false);

			toast.success('Auction Deleted Successfully');
			setTimeout(() => {
				navigate('/');
			}, 1000);
		} else if (statusForDelete === 'error') {
			setModalShow(false);
			toast.error(errorForDelete);
		}
	};

	const ExtendAuctionTimeModalHandler = AuctionId => {
		setExtendAuctionId(AuctionId);
		setModalShow(true);
	};

	return (
		<>
			<ToastContainer theme="dark" />
			{loading && <LoadingSpinner /> }
			{/* start buyer */}
			{/* start when auction ongoing */}
			{(role === 'buyer' || !isLoggedIn)&& OnGoingStatus && !AuctionEndMessage && (
				<div
					className={`${
						isJoined ? 'd-flex justify-content-around mt-3' : 'd-block'
					} `}
				>
					<button
						className={`btn fw-bold  fs-5  ${classes.btnPlaceBid_} ${
							!isJoined ? classes.btnJoinActive : ''
						}`}
						type="button"
						onClick={() => joinAuctionHandler(OnGoingStatus)}
					>
						{OnGoingStatus && isJoined ? 'Place a Bid' : 'Join Auction'}
					</button>
					{/* leave auction */}
					{isJoined && (
						<button
							className={`btn fw-bold text-light  fs-5   ${
								classes.btnLeaveBid
							} ${isJoined && OnGoingStatus && 'bg-danger'}`}
							type="button"
							onClick={LeaveAuctionHandler}
						>
							Leave Auction
						</button>
					)}
				</div>
			)}
			{/* start when auction upcoming */}
			{role === 'buyer' && UpComingStatus && (
				<button
					className={`btn w-100 fw-bold ${classes.btnPlaceBid}`}
					type="button"
					onClick={() => setModalShow(true)}
					disabled={btnSavedValue === 'Saved'}
				>
					{UpComingStatus && btnSavedValue}
				</button>
			)}

			{(role === 'admin' || role === 'employee') &&
				AuctionStatus === 'pending' && (
					<div className="d-flex justify-content-evenly mt-3">
						<button
							className={`btn w-100 fw-bold bg-success ${classes.btnReject}`}
							type="button"
							onClick={approveHandler}
						>
							Approve
						</button>
						<button
							className={`btn w-100 mx-2 fw-bold bg-danger ${classes.btnReject}`}
							type="button"
							onClick={() => setModalShow(true) }
						>
							Reject
						</button>
					</div>
				)}

			{/* ******************** start seller Actions ******************** */}
			{/*  start update Auction  */}
			{(role === 'seller' && email === sellerEmail && !OnGoingStatus && isLoggedIn ) && (
				<div className="d-flex justify-content-evenly mt-3">
					<button
						className={`btn w-100 fw-bold bg-success text-light ${classes.btnReject} `}
						type="button"
					>
						<Link
							to={`/seller-dashboard/UpdateAuction?id=${AuctionId}`}
							className="text-light text-decoration-none"
						>
							Update
						</Link>
					</button>
					<button
						className={`btn w-100 mx-2 fw-bold bg-danger  ${classes.btnReject}`}
						type="button"
						onClick={() => setModalShow(true)}
					>
						delete
					</button>
				</div>
			)}
			{/*  end update Auction  */}

			{/*  start denied Auction  */}
			{role === 'seller' && DeniedStatus && (
				<div className=" bg-warning mt-3 p-3">
					<h5 className=" text-black fw-bold">
						Rejected because : {RejectionMessage}
					</h5>
				</div>
			)}
			{/* start extend auction time */}
			{/*  */}
			{role === 'seller' &&
				!AuctionEndMessage &&
				!UpComingStatus &&
				OnGoingStatus && (
					<div className="d-flex justify-content-evenly mt-3">
						<button
							className={`btn w-100 mx-2 fw-bold bg-danger ${classes.btnPlaceBid}`}
							type="button"
							onClick={() => ExtendAuctionTimeModalHandler(AuctionId)}
						>
							Extend Auction Time
						</button>
					</div>
				)}

			<ModalUi
				show={modalShow}
				onHide={() => setModalShow(false)}
				UpComingAuction={UpComingStatus}
				btnReject={PendingStatus}
				rejectHandler={rejectHandler}
				btnSaved={btnSaved}
				SavedAuctionId={AuctionId}
				btnRemove={() => DeleteAuction(AuctionId)}
				btnExtendAuction={ExtendAuctionId}
				loading = {(value)=> setLoading(value)}

				// *********** start bidding ************ //

				// start join Auction
				btnBiddingHandler={value => btnBiddingHandler(value)}
				BidNow={BidNow}
				// if bidder accept block money from your wallet
				btnConfirmationHandler={btnConfirmationHandler}
				ConfirmJoin={
					ConfirmJoin &&
					`We Will Block this Chair Cost ${chairCost} from Your Balance`
				}
				// end join Auction

				errorWhenJoinAuction={
					isExistErrorWhenJoinAuction && isExistErrorWhenJoinAuction
				}
				MinimumBidAllowed={MinimumBidAllowed && MinimumBidAllowed}
				chairCost={chairCost}
				// start RetreatModal
				RetreatModalTitle={RetreatModalTitle}
				RetreatModelHandler={RetreatModelHandler}
				// end RetreatModal

				// *********** end bidding ************ //
			/>
		</>
	);
}

export default AuctionFooter;
