import React, { useEffect, useState } from 'react';
import './profile.css';
import './tabs.css';
import coverImg from '../../../assets/fbc2a961bfd0e7b5673a7922cb848cdb.jpg';
import profileImg from '../../../assets/download.png';
import {
	faBan,
	faCircleExclamation,
	faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProfileDetails from './profileDetails/profileDetails';
import Auctions from './Auctions/Auctions';
import Reviews from './Reviews/Reviews';
import OverallReviewBar from './Reviews/overallReviewBar';
import { useSelector } from 'react-redux';
import BlockModal from './../Modals/BlockModal';
import WarnModal from './../Modals/WarnModal';
import { MakeAComplaintModal } from './MakeAComplaint';
import { useNavigate } from 'react-router-dom';
const UserProfile = props => {
	const role = useSelector(store => store.AuthData.role);
	// Handle Tabs
	const [isShownDetails, setIsShownDetails] = useState(true);
	const [isShownAuctions, setIsShownAuctions] = useState(false);
	const [isShownReviews, setIsShownReviews] = useState(false);
	// modal handle
	const [isShownWarnModal, setIsShownWarnModal] = useState(false);
	const [isWarned, setIsWarned] = useState(false);

	const [isShownBlockModal, setIsShownBlockModal] = useState(false);
	const [isBlocked, setIsBlocked] = useState(false);

	const [isShownComplaintModal, setIsShownComplaintModal] = useState(false);

	// end
	// reload users table when warn or block user
	const [reload, setReload] = useState('');

	const [userId, setUserId] = useState('');

	// start state to show component of chat
	// const [ViewChatWithSeller , setViewChatWithSeller ] = useState(false)
	const navigate = useNavigate();
	// end to show component of chat

	const btnDetailsHandler = () => {
		setIsShownDetails(true);
		setIsShownAuctions(false);
		setIsShownReviews(false);
	};

	const btnAuctionsHandler = () => {
		setIsShownDetails(false);
		setIsShownReviews(false);
		setIsShownAuctions(true);
	};
	const btnSellerReviews = () => {
		setIsShownDetails(false);
		setIsShownAuctions(false);
		setIsShownReviews(true);
	};
	// end
	// start warn handler
	const warnHandler = (id, isWarned) => {
		setUserId(id);
		setIsShownWarnModal(true);
		setIsWarned(isWarned);
	};
	// end warn handler

	// start block handler
	const blockHandler = (id, isBlocked) => {
		setUserId(id);
		setIsShownBlockModal(true);
		setIsBlocked(isBlocked);
	};
	// end block handler
	// start complaint handler
	const ComplaintHandler = id => {
		setUserId(id);
		setIsShownComplaintModal(true);
	};

	// start chat With seller
	const chatWithSellerHandler = () => {
		// setViewChatWithSeller(true)
		navigate(`/buyer-dashboard/chat?email=${props.seller.email}`);
	};

	// end chat With seller

	useEffect(() => {
		props.onReload(reload);
	}, [reload]);

	return (
		<>
			<div className="container-fluid container_profile">
				<section className="header_container position-relative">
					<header className="header">
						<img src={coverImg} alt="coverImg" />
						<div className="profile">
							<div className="profile-Image">
								{props.seller && props.seller.image ? (
									<img
										src={
											props.seller.image &&
											props.seller.image.url &&
											`${props.seller['image']['url']}`
										}
										alt="userImage"
									/>
								) : (
									<img src={profileImg} alt="imageProfile" />
								)}
								<h5 className="text-light">{props.name}</h5>
								<p>{props.role}</p>
								<h4 className="text-light fw-bold d-inline-block position-absolute bar">
									Rating {props.seller && props.seller.rating} /5
								</h4>
								<h4 className="text-light fw-bold d-inline-block position-absolute numOfReviewers">
									From : {props.reviews && props.reviews.length} bidder
								</h4>
								<OverallReviewBar
									value={props.seller && props.seller.rating}
									class="profile_bar"
								/>
							</div>
						</div>
						{(role === 'admin' || role === 'employee') && (
							<>
								<button
									type="button"
									className="btn  text-light fw-bold btn_compliment btn_warn position-absolute "
									onClick={() =>
										warnHandler(props.seller._id, props.seller.isWarned)
									}
								>
									{props.seller && props.seller.isWarned ? (
										<>
											<FontAwesomeIcon icon={faCircleXmark} className="px-1" />
											<span className="RemoveBadge btn-remove">
												Remove Warn{' '}
											</span>
										</>
									) : (
										// btn show when user is not warned
										<>
											<FontAwesomeIcon
												icon={faCircleExclamation}
												className="pe-1"
											/>
											Warn
										</>
									)}
								</button>
								<button
									type="button"
									className="btn bg-danger text-light fw-bold btn_chat position-absolute"
									onClick={() =>
										blockHandler(props.seller._id, props.seller.isBlocked)
									}
								>
									{props.seller && props.seller.isBlocked ? (
										<>
											<FontAwesomeIcon icon={faCircleXmark} />
											<span className="RemoveBadge btn-remove"> UnBlock </span>
										</>
									) : (
										// btn show when user is not Blocked
										<>
											<FontAwesomeIcon icon={faBan} className="pe-1" />
											Block
										</>
									)}
								</button>
							</>
						)}

						{role === 'buyer' && (
							<>
								<button
									className="btn btn-success btn_chat d-block mb-2 position-absolute"
									onClick={chatWithSellerHandler}
								>
									Chat with seller
								</button>
								<button
									onClick={() =>
										ComplaintHandler(props.seller && props.seller._id)
									}
									className="btn text-light btn_compliment d-block mb-2 position-absolute"
								>
									Make a compliment
								</button>
							</>
						)}
					</header>
				</section>
				{/* tabs */}
				<div className={'AuctionHeader'}>
					<button
						className={`btn ${isShownDetails ? 'ActiveLink' : ''}`}
						onClick={btnDetailsHandler}
					>
						Details
					</button>

					<button
						className={`btn ${isShownAuctions ? 'ActiveLink' : ''}`}
						onClick={btnAuctionsHandler}
					>
						Auctions
					</button>
					<button
						className={`btn ${isShownReviews ? 'ActiveLink' : ''}`}
						onClick={btnSellerReviews}
					>
						Reviews
					</button>
				</div>
				{isShownDetails && (
					<ProfileDetails
						sellerData={props.seller}
						data={props.data}
						reviewsHandler={btnSellerReviews}
						auctionsHandler={btnAuctionsHandler}
					/>
				)}
				{isShownAuctions && <Auctions auctionsData={props.auctions} />}
				{isShownReviews && (
					<Reviews
						reviews={props.reviews}
						seller={props.seller}
						onReload={value => setReload(value)}
						reload={reload}
					/>
				)}
				{/* end tabs */}
				{/* start warn modal */}
				{isShownWarnModal && (
					<WarnModal
						id={userId}
						show={isShownWarnModal}
						onHide={() => setIsShownWarnModal(false)}
						isWarned={isWarned}
						onReload={value => setReload(value)}
					/>
				)}
				{/* end warn modal */}

				{/* start Block modal */}
				{isShownBlockModal && (
					<BlockModal
						id={userId}
						show={isShownBlockModal}
						onHide={() => setIsShownBlockModal(false)}
						isBlocked={isBlocked}
						onReload={value => setReload(value)}
					/>
				)}

				{/* end Block modal */}

				{/* start complaint modal */}
				{isShownComplaintModal && (
					<MakeAComplaintModal
						id={userId}
						show={isShownComplaintModal}
						onHide={() => setIsShownComplaintModal(false)}
						onReload={value => setReload(value)}
					/>
				)}

				{/* start chatWithSeller */}
				{/* {ViewChatWithSeller && <BuyerChat SellerEmail={props.seller && props.seller.email} />} */}
				{/* end chat with seller */}
			</div>
		</>
	);
};
export default UserProfile;


	/* <hr className="bg-light profileHr2" /> */

