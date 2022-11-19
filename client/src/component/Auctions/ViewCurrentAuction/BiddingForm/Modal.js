import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SaveAuctionApi } from '../../../../Api/BuyerApi';
import { ExtendAuctionAi } from '../../../../Api/SellerApi';
import useHttp from '../../../../CustomHooks/useHttp';
import classes from './Modal.module.css';

const ModalUi = props => {
	const [BidValue, setBidValue] = useState();
	console.log(props.MinimumBidAllowed &&  props.MinimumBidAllowed)
	const [isBidValid, setIsBidValid] = useState(true);
	const rejectRef = useRef();
	const AmountRef = useRef();

	const role = useSelector(store => store.AuthData.role);
	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn);
	const idToken = useSelector(store => store.AuthData.idToken);

	// start Extend Auction Time
	const [ExtendDay, setExtendDay] = useState(0);
	const [ExtendHour, setExtendHour] = useState(0);
	const [ExtendMinutes, setExtendMinutes] = useState(0);

	// start sendRequestForExtendAuction
	const {
		sendRequest: sendRequestForExtendAuction,
		status: statusForExtendAuction,
		error: errorForExtendAuction,
	} = useHttp(ExtendAuctionAi);

	// start Saved Auction Handler
	const {
		sendRequest: sendRequestForSaveAuction,
		status: statusForSaveAuction,
		data: dataForSaveAuction,
		error: errorForSaveAuction,
	} = useHttp(SaveAuctionApi);

	const btnSavedHandler = () => {
		props.loading(true)
		const id = props.SavedAuctionId;
		sendRequestForSaveAuction({ idToken, id });
	};

	useEffect(() => {
		if (statusForSaveAuction === 'completed') {
			props.loading(false)
			toast.success(dataForSaveAuction.message);
			props.btnSaved('Saved');
			props.onHide();
		}
	}, [statusForSaveAuction]);

	useEffect(() => {
		if (statusForSaveAuction === 'error') {
			props.loading(false)
			toast.error(errorForSaveAuction);
			props.btnSaved('Save Auction');
			props.onHide();
		}
	}, [statusForSaveAuction]);

	// end Saved Auction Handler

	const BidValueValidation = e => {
		setBidValue(e.target.value);
		if (e.target.value.trim() < props.MinimumBidAllowed) {
			setIsBidValid(false);
		} else {
			setIsBidValid(true);
		}
	};

	// start btnExtendAuctionHandler in seller
	const btnExtendAuctionHandler = () => {
		props.loading(true)
		const AuctionId = props.btnExtendAuction;
		const ExtendData = {
			days: ExtendDay ? parseInt(ExtendDay) : 0,
			hours: ExtendHour ? parseInt(ExtendHour) : 0,
			minutes: ExtendMinutes ? parseInt(ExtendMinutes) : 0,
		};
		sendRequestForExtendAuction({ AuctionId, idToken, ExtendData });
	};

	useEffect(() => {
		if (statusForExtendAuction === 'completed') {
			props.loading(false)

			toast.success(
				'Time extension request sent and now waiting for approval ✔✔',
			);
			props.onHide();
		} else if (statusForExtendAuction === 'error') {
			props.loading(false)
			toast.error(errorForExtendAuction);
			props.onHide();
		}
	}, [statusForExtendAuction]);

	// end btnExtendAuctionHandler in seller

	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			className={classes.BiddingModal}
		>
			{/* Modal Header */}

			<Modal.Header closeButton className={classes.BiddingModalHeader}>
				<Modal.Title id="contained-modal-title-vcenter">
					{isLoggedIn &&
						!props.UpComingAuction &&
						role === 'buyer' &&
						!!!props.errorWhenJoinAuction &&
						props.BidNow &&
						!!!props.RetreatModelTitle &&
						!!!props.ConfirmJoin && <h2 className="fw-bold">Place a Bid </h2>}

					{/* start View exception when true to join  */}
					{isLoggedIn &&
						!props.UpComingAuction &&
						role === 'buyer' &&
						!!props.errorWhenJoinAuction && (
							<h2 className="fw-bold"> {props.errorWhenJoinAuction} </h2>
						)}
					{!isLoggedIn && (
						<h5 className="text-center pt-3">
							Please Login in First, before placing a bid
						</h5>
					)}
					{isLoggedIn && props.UpComingAuction && role === 'buyer' && (
						<h5 className="text-center pt-3">
							We will Notify you when Auction be ongoing
						</h5>
					)}
					{props.btnReject && (role === 'admin' || role === 'employee') && (
						<h5> write a reason for reject</h5>
					)}

					{/* start retreat From Auction */}
					{isLoggedIn &&
						props.RetreatModalTitle &&
						props.RetreatModelHandler && <h5> {props.RetreatModalTitle} </h5>}
					{/* end retreat From Auction */}

					{/* start ConfirmJoin */}
					{props.ConfirmJoin && props.btnConfirmationHandler && isLoggedIn && (
						<h5> {props.ConfirmJoin} </h5>
					)}
					{/* end ConfirmJoin */}

					{/* start Extend Auction Time */}
					{isLoggedIn &&
						props.btnExtendAuction &&
						role === 'seller' &&
						!props.UpComingAuction && (
							<h2 className="fw-bold"> Extend Auction Time </h2>
						)}
					{/* end Extend Auction Time */}
				</Modal.Title>
			</Modal.Header>

			{/* Modal Body when user Is loggedIn && Auction status is ongoing  */}
			<Modal.Body className={classes.BiddingModalBody}>
				<>
					{/* *********** start for seller ********************  */}
					{isLoggedIn && role === 'seller' && !props.btnExtendAuction && (
						<h1 className="text-light text-center">
							Are you sure to delete this auction
						</h1>
					)}
					{/* start Extend Auction Time */}
					{props.btnExtendAuction &&
						role === 'seller' &&
						isLoggedIn &&
						!props.UpComingAuction && (
							<div className={classes.ExtendAuctionContainer}>
								<div className={`${classes.Days} d-flex flex-column`}>
									<p> Days</p>
									<input
										type="number"
										className={`${classes.Extend} form-control`}
										min={0}
										max={30}
										value={ExtendDay}
										onChange={e => setExtendDay(e.target.value)}
									/>
								</div>
								<div className={`${classes.Hours} d-flex flex-column `}>
									<p> Hours</p>
									<input
										type="number"
										className={`${classes.Extend} form-control`}
										min={0}
										max={12}
										value={ExtendHour}
										onChange={e => setExtendHour(e.target.value)}
									/>
								</div>
								<div className={`${classes.Minutes} d-flex flex-column`}>
									<p> Minutes</p>
									<input
										type="number"
										className={`${classes.Extend} form-control`}
										min={0}
										max={60}
										value={ExtendMinutes}
										onChange={e => setExtendMinutes(e.target.value)}
									/>
								</div>
							</div>
						)}
					{/* end Extend Auction Time */}

					{/* *********** start for seller ********************  */}

					{/* end for seller  */}

					{/* for buyer */}
					{isLoggedIn &&
						!props.UpComingAuction &&
						role === 'buyer' &&
						!!!props.errorWhenJoinAuction &&
						props.BidNow &&
						!!!props.RetreatModelTitle &&
						!!!props.ConfirmJoin && (
							<>
								<div
									className={` ${classes['ModalBodyForm']} ${
										!isBidValid ? 'pb-2' : ''
									}`}
								>
									<div className="input-group">
										<input
											type="number"
											className="form-control"
											min={props.MinimumBidAllowed}
											value={BidValue ? BidValue : props.MinimumBidAllowed }
											onChange={BidValueValidation}
											ref={AmountRef}
											// placeholder={props.MinimumBidAllowed}
										/>
										<span
											className={` input-group-text ${classes['input-group-text']} `}
										>
											$
										</span>
									</div>
									{!isBidValid && (
										<p className="px-2">
											You must bid at least
											<span className={classes.bidValue}>
												{' '}
												{props.MinimumBidAllowed}{' '}
											</span>
										</p>
									)}
								</div>

								<div className="pt-4">
									<div className="d-flex justify-content-between">
										<p> Minimum Bid </p>
										<p> {props.MinimumBidAllowed} </p>
									</div>

									<div className="d-flex justify-content-between">
										<p> Minimum Bid After Your Bidding </p>
										<p className={!isBidValid ? classes['Alarm'] : ''}>
											{' '}
											{parseInt(BidValue)
												? parseInt(BidValue) + 100
												: +props.MinimumBidAllowed}{' '}
											${' '}
										</p>
									</div>
								</div>
							</>
						)}
					{/*for  Admin  */}
					{props.btnReject && (role === 'admin' || role === 'employee') && (
						<input
							type="text"
							placeholder="Type reason here ..."
							className={`${classes.reject} form-control`}
							ref={rejectRef}
						/>
					)}
				</>
			</Modal.Body>

			<Modal.Footer className={classes['HideBorder']}>
				<div className="d-flex gap-2 col-12 mx-auto">
					{/* start user not logged in */}
					{!isLoggedIn && (
						<Link
							className={`btn col fw-bold bg-light ${classes.btnLogin}`}
							type="button"
							to="/login"
						>
							Login
						</Link>
					)}
					{/* end user not logged in */}

					{/* start buyer modal */}
					{isLoggedIn &&
						!props.UpComingAuction &&
						role === 'buyer' &&
						!!!props.errorWhenJoinAuction &&
						props.BidNow &&
						!!!props.RetreatModelTitle &&
						!!!props.ConfirmJoin && (
							<button
								className={`btn col fw-bold bg-light ${classes.btnPlaceMyBid}`}
								type="button"
								onClick={() =>
									props && props.btnBiddingHandler(AmountRef.current.value)
								}
							>
								Place My Bid
							</button>
						)}

					{isLoggedIn &&
						props.RetreatModalTitle &&
						props.RetreatModelHandler &&
						!props.UpComingAuction &&
						!!!props.errorWhenJoinAuction &&
						!props.BidNow && (
							<button
								onClick={props.RetreatModelHandler}
								className={`btn col fw-bold bg-light ${classes.btnPlaceMyBid}`}
							>
								{' '}
								ConFirm{' '}
							</button>
						)}

					{isLoggedIn &&
						props.btnConfirmationHandler &&
						props.ConfirmJoin &&
						!props.UpComingAuction &&
						!!!props.errorWhenJoinAuction &&
						!props.BidNow && (
							<button
								onClick={props.btnConfirmationHandler}
								className={`btn col fw-bold bg-light ${classes.btnPlaceMyBid}`}
							>
								{' '}
								ConFirm{' '}
							</button>
						)}

					{isLoggedIn && props.UpComingAuction && role === 'buyer' && (
						<button
							className={`btn col fw-bold bg-light ${classes.btnLogin}`}
							type="button"
							onClick={btnSavedHandler}
						>
							Save
						</button>
					)}
					{/* end buyer modal */}

					{/* start Admin modal */}
					{props.btnReject && (role === 'admin' || role === 'employee') && (
						<button
							className={`btn col fw-bold bg-light ${classes.btnLogin}`}
							type="button"
							onClick={() => props.rejectHandler(rejectRef.current.value)}
						>
							Submit
						</button>
					)}
					{/* start Admin modal */}

					{/* start seller modal */}
					{isLoggedIn && role === 'seller' && !props.btnExtendAuction && (
						<button
							className={`btn col fw-bold bg-light ${classes.btnLogin}`}
							type="button"
							onClick={props.btnRemove}
						>
							Delete
						</button>
					)}

					{/* start Extend Auction Time  */}
					{/*  && !props.UpComingAuction */}
					{props.btnExtendAuction &&
						role === 'seller' &&
						isLoggedIn &&
						!props.UpComingAuction && (
							<button
								className={`btn col fw-bold bg-light ${classes.btnLogin}`}
								type="button"
								onClick={btnExtendAuctionHandler}
							>
								Extend
							</button>
						)}
					{/* end Extend Auction Time  */}

					{/* end seller modal */}

					<button
						className={`btn col-6 fw-bold bg-danger ${classes.btnCloseModal}`}
						type="button"
						onClick={props.onHide}
					>
						Close
					</button>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalUi;
