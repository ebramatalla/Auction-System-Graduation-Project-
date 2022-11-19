import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import {
	faEnvelope,
	faLocationDot,
	faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './Footer.module.css';
import { useSelector } from 'react-redux';
import ModalUi from '../../UI/Modal/modal';

function Footer() {
	// start contact us
	const contactUsData = [
		{ text: '(+20) 12547554', icon: faPhone },
		{ text: 'OnlineAuction@email.com', icon: faEnvelope },
		{ text: 'Company Address', icon: faLocationDot },
	];
	const ContactUs = contactUsData.map((data, index) => (
		<Col md={4} sm={6} xs={12} key={index} className="mb-3">
			<FontAwesomeIcon icon={data.icon} className={classes.ContactIcon} />
			<p> {data.text} </p>
		</Col>
	));
	// end contact us

	// start footer chat path

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

	const HideContactChat = role === 'admin' || role === 'employee';

	// start footerMoreDetails
	const FooterMoreDetailsData = [
		{
			text: 'Pages',
			links: [
				{ name: 'Home Page', path: '/' },
				{ name: 'Auctions', path: '/auctions' },
				{ name: 'How Bid', path: '#' },
				{ name: 'Categories', path: '/auctions' },
			],
		},
		{
			text: 'Buy',
			links: [
				{ name: 'Registration', path: '/register' },
				{ name: 'Charge Wallet', path: '#' },
				{ name: 'Bidding', path: '#' },
			],
		},
		{
			text: 'Sell',
			links: [
				{ name: 'Login', path: '/' },
				{ name: 'Start Selling', path: '/auctions' },
			],
		},
		{
			text: 'Contact Us',
			links: [{ name: 'Chat now', path: ChatPath(), className: 'SupportLink' }],
		},
	];

	const FooterMoreDetails = FooterMoreDetailsData.map((data, index) => (
		<Col lg={!HideContactChat ? 3 : 4} sm={4} xs={12} key={index}>
			<h5
				className={`${
					HideContactChat && data.text === 'Contact Us' ? 'd-none' : 'd-block'
				} ${data.text === 'Contact Us' && classes.ContactStyle} `}
			>
				{data.text}
			</h5>
			{data.text === 'Contact Us' && (
				<p
					className={`${HideContactChat ? 'd-none' : 'd-block'} ${
						classes.Support
					}`}
				>
					{' '}
					Question? We've got answers.{' '}
				</p>
			)}
			<ul>
				{data.links.map((_link, index) => (
					<li
						key={index}
						className={
							_link.name === 'Chat now' && HideContactChat
								? 'd-none'
								: 'd-block'
						}
					>
						{!isLoggedIn && _link.name === 'Chat now' ? (
							<button
								className={` ${classes.footerLinks} ${_link.className &&
									classes[_link.className]}`}
								onClick={() => setShowModal(true)}
							>
								{_link.name}
							</button>
						) : (
							<Link
								to={_link.path}
								className={`text-decoration-none ${
									classes.footerLinks
								} ${_link.className && classes[_link.className]}`}
							>
								{_link.name}
							</Link>
						)}
					</li>
				))}
			</ul>
		</Col>
	));

	//end footerMoreDetails

	return (
		<>
			<div className={`${classes.Footer} `}>
				{/* start contact details */}
				<div className={classes.ContactUs}>
					<Row className="m-0 p-0">{ContactUs} </Row>
				</div>
				{/* end contact details */}

				{/* start footer links and details */}
				<div className={classes.FooterMoreDetails}>
					<Row className="m-0 p-0">{FooterMoreDetails}</Row>
				</div>
				{/* end footer links and details */}

				<div className={classes.SocialMediaIcons}>
					<p> &copy; 2022 OnlineAuction.com</p>
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
		</>
	);
}

export default Footer;
