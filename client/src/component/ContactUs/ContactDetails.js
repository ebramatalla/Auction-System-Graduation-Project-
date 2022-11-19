import {
	faComment,
	faEnvelope,
	faLocationDot,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import style of Contact us
import classes from './ContactDetails.module.css';
import ModalUi from '../UI/Modal/modal';

const ContactDetails = () => {
	const role = useSelector(store => store.AuthData.role);
	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn);

	const [ShowModal, setShowModal] = useState(false);
	const redirectUserToHomePage = useNavigate();

	const ChatPath = () => {
		if (role === 'seller') {
			return '/seller-dashboard/chat?email=Support@email.com';
		}
		if (role === 'buyer') {
			return '/buyer-dashboard/chat?email=Support@email.com';
		}
		return '/';
	};

	return (
		<React.Fragment>
			<div className={` ${classes.ContactDetails} p-0`}>
				<h4 className="text-center">Contact Details</h4>

				<div className="mt-2">
					<FontAwesomeIcon
						icon={faLocationDot}
						className={classes.ContactIcon}
					/>
					<p> Company Address </p>
				</div>
				<div className="mt-2">
					<FontAwesomeIcon icon={faPhone} className={classes.ContactIcon} />
					<p> (+20) 12547554 </p>
				</div>
				<div className="mt-2">
					<FontAwesomeIcon icon={faEnvelope} className={classes.ContactIcon} />
					<p> onlineAuction@email.com </p>
				</div>

				<div
					className={
						(role === 'admin' || role === 'employee') ? 'd-none' : 'd-block mt-2'
					}
				>
					<FontAwesomeIcon icon={faComment} className={classes.ContactIcon} />
					<p> You can chat with out support team</p>
					{!isLoggedIn ? (
						<button
							className={`${classes.btnChatNow} `}
							onClick={() => setShowModal(true)}
						>
							Chat Now
						</button>
					) : (
						<Link className={`${classes.ChatNow} `} to={ChatPath()}>
							Chat Now
						</Link>
					)}
				</div>
			</div>
			{/* start Modal when unauthorized user want to chat with agent */}
			{ShowModal && (
				<ModalUi
					show={ShowModal}
					onHide={() => setShowModal(false)}
					title="You need to login to chat with our support team 🔐"
					btnName={'Log in'}
					btnHandler={() => redirectUserToHomePage('/login')}
				/>
			)}
			{/* end Modal when unauthorized user want to chat with agent */}
		</React.Fragment>
	);
};

export default ContactDetails;
