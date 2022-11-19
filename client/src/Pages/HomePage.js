import React, { Fragment } from 'react';

import Header from '../component/HomePage/Header/Header';
import UpComingAuctions from '../component/HomePage/UpComingAuctions/UpComingAuctions';
import OnGoingAuctions from '../component/HomePage/OnGoingAuctions/OnGoingAuctions';
import Footer from '../component/HomePage/Footer/Footer';

import scrollbarStyle from '../component/UI/ScrollBar.module.css';
import HowBid from '../component/HowBid/HowBid';

const HomePage = () => {
	return (
		<Fragment>
			<div
				className={`${scrollbarStyle.scrollbar} container-fluid px-0`}
				style={{ backgroundColor: '#191a19', minHeight: '100vh' }}
			>
				<Header />
				<OnGoingAuctions />
				<HowBid />

				<UpComingAuctions />
				<Footer />
			</div>
		</Fragment>
	);
};

export default HomePage;
