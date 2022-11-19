import React, { Fragment, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Link, useLocation } from 'react-router-dom';

import Navbar from '../../HomePage/Header/Navbar';

import ViewAuctionDetails from '../../UI/ViewAuctionDetails/ViewAuctionDetails';
import useHttp from '../../../CustomHooks/useHttp';
import { getCategoryAuctions } from '../../../Api/CategoryApi';

import classes from './ViewCategoryAuctions.module.css';

const ViewCategoryAuctions = () => {
	const [changeCategory, setChangeCategory] = useState(false);
	const [showRestItems, setShowRestItems] = useState(false);

	const { sendRequest, status, data } = useHttp(getCategoryAuctions);
	// !filter data to not show denied and pending auctions
	const filteredData =
		data &&
		data.filter(item => item.status !== 'denied' && item.status !== 'pending');
	const FirstThreeItems = filteredData && filteredData.slice(0, 3);
	const RestItems = filteredData && filteredData.slice(3);

	const location = useLocation();
	const CategoryId = new URLSearchParams(location.search).get('id');

	useEffect(() => {
		if (CategoryId) {
			setChangeCategory(Math.random());
		}
	}, [CategoryId]);

	useEffect(() => {
		sendRequest(CategoryId && CategoryId);
	}, [sendRequest, changeCategory]);

	useEffect(() => {
		if (status === 'completed') {
		}
	}, [sendRequest, changeCategory]);
	return (
		<Fragment>
			<div className={classes.ViewCategoryAuctions}>
				<Navbar />
				{data && data.length > 0 && status === 'completed' && (
					<ViewAuctionDetails AuctionData={FirstThreeItems} />
				)}
				{showRestItems && data && data.length > 0 && status === 'completed' && (
					<ViewAuctionDetails AuctionData={RestItems} animate={true} />
				)}

				{status === 'completed' && (!data || data.length === 0) && (
					<div class="alert bg-danger text-center p-4" role="alert">
						<h3 className="mb-4 fw-bold text-light">
							{' '}
							No Auctions in this Category{' '}
						</h3>
						<Link
							className={`text-decoration-none  p-2 px-4  fw-bold	${classes.btnBackHome}`}
							to="/home-page"
						>
							{' '}
							Back To HomePage{' '}
						</Link>
					</div>
				)}
				{!showRestItems && data && data.length > 3 && (
					<div className="w-100">
						<button
							className={` text-light  ${classes.btnGetAuctions}`}
							onClick={() => setShowRestItems(true)}
						>
							See All Auctions <span></span>
							<FontAwesomeIcon icon={faCircleArrowRight} />
						</button>
					</div>
				)}
			</div>
		</Fragment>
	);
};

export default ViewCategoryAuctions;
