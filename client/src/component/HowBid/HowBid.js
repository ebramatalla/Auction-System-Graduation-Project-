// import style of HowBid
import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../HomePage/Header/Navbar';
import classes from './HowBid.module.css';
import HowBidCard from './HowBidCard';

const CardDetails = ({ Title, Text, btnText, linkTo, CardStyle }) => {
	return (
		<HowBidCard className={CardStyle ? CardStyle : ''}>
			<div className={`${classes['card-content']} `}>
				<h3 className={`${classes.Step} text-center `}> {Title}</h3>
				<p
					className={`${classes.paragraphS} ${
						CardStyle !== '' ? classes.paragraphChangeColor : ''
					} text-center`}
				>
					{/* Join to bid you want{' '} */}
					{Text}
				</p>
			</div>

			<div className={`text-center mt-2 ${classes.CardDetails}`}>
				<Link
					className={`btn btn-secondary text-decoration-none fs-6 fw-bold text-light ${classes.btnCardDetails} `}
					to={linkTo}
				>
					{btnText}
				</Link>
			</div>
		</HowBidCard>
	);
};
const HowBid = () => {
	const AllCardsDetails = [
		{
			Title: 'Step1',
			Text: 'You must be login',
			btnText: 'Login',
			linkTo: '/login',
			CardStyle: '',
		},
		{
			Title: 'Step2',
			Text: 'Charge Your Wallet',
			btnText: 'Charge Wallet',
			linkTo: '',
			CardStyle: `${classes.changeCardColor} text-center `,
		},
		{
			Title: 'Step3',
			Text: 'Join to Bid You Want',
			btnText: 'Join Bid',
			linkTo: '',
			CardStyle: '',
		},
		{
			Title: 'Step4',
			Text: 'Interact With Auction',
			btnText: 'Interact and Bid',
			linkTo: '',
			CardStyle: `${classes.changeCardColor} text-center `,
		},
	];

	return (
		<React.Fragment>
			<Navbar />
			<div className={` ${classes.HowBid} `}>
				{/* start How Bid Content */}
				<h3 className={`${classes.header3} text-center fw-bold `}>
					How Bid ?!
				</h3>
				<p className={`${classes.paragraph}`}>
					Let's go on a trip through OnLine Auction
				</p>
				{/* start card group */}
				<div className={`${classes.Steps} row m-0 p-0 `}>
					{AllCardsDetails.map((card, index) => (
						<div className="col-lg col-md-6 col-sm-6 my-5" key={index}>
							{CardDetails({ ...card })}
						</div>
					))}
				</div>
			</div>

			{/* end How Bid Content */}
		</React.Fragment>
	);
};

export default HowBid;
