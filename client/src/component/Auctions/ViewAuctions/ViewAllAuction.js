import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import { getAllAuctions } from '../../../Api/AuctionsApi';
import useHttp from '../../../CustomHooks/useHttp';
import ViewAuctionDetails from '../../UI/ViewAuctionDetails/ViewAuctionDetails';

import PageHeader from '../../UI/Page Header/pageHeader';
import NoData from '../../UI/NoData';

import classes from './ViewAllAuctions.module.css';
import FilterdAuctions from './FilterdAuction';
import Navbar from '../../HomePage/Header/Navbar';
import LoadingSpinner from '../../UI/Loading/LoadingSpinner';

const ViewAllAuctions = ({AuctionStatus}) => {
	const [showFilter, setShowFilter] = useState(null);
	const [FilterAuction, setFilterAuction] = useState(false);
	const [FilterdDetails, setFilterdDetails] = useState(null);

	const [loading , setLoading] = useState(false)

	const { sendRequest, status, data } = useHttp(getAllAuctions);

	useEffect(() => {
		if (!FilterAuction) {
			if(AuctionStatus) {
				// setLoading(true)
				sendRequest(`?status=${AuctionStatus}&`);
			}
			else{
				// setLoading(true)
				sendRequest();
			}
		} else {
			if (FilterdDetails.AuctionType || FilterdDetails.AuctionCategory) {
				// setLoading(true)
				
				const queryParams = `${
					FilterdDetails.AuctionCategory
						? `?category=${FilterdDetails.AuctionCategory}&`
						: '?'
				}${FilterdDetails.AuctionType &&
					`status=${FilterdDetails.AuctionType}&`}`;
				sendRequest(queryParams);

			}
		}

	}, [sendRequest, FilterAuction, FilterdDetails]);

	const showFilterHandler = () => {
		setShowFilter(true);
	};

	const hideFilterHandler = () => {
		setShowFilter(false);
	};

	const filterHandler = values => {
		if (values) {
			setFilterAuction(true);
			setFilterdDetails(values);

		} else {
			// setLoading(false)
			setFilterAuction(false);
		}
	};

	useEffect(()=>{
		if(status === 'completed'){
			setLoading(false)
		}
		else if(status === 'error'){
			setLoading(false)
		}
	} , [status])
	return (
		<div className={classes.ViewAllAuctions}>
			{loading && <LoadingSpinner /> }
			<Navbar />
			<Row className="m-0 p-0">
				<Col md={4} lg={2} className="m-0 p-0">
					<FilterdAuctions
						hideFilter={hideFilterHandler}
						showFilter={showFilter}
						filterHandler={filterHandler}
						filter={FilterAuction}
						clearFilter={() => setFilterAuction(false)}
					/>
				</Col>

				<Col md={8} lg={10}>
					{(data && data.length > 0 && status==='completed') ? (
						<div className={classes.AllAuction}>
							<PageHeader text="All Auctions" showLink={false} />

							{/* Auction Filter in Small Media Query */}
							<div
								className={`${classes.FilterIcons} ${
									showFilter ? 'mt-0' : ''
								} text-end `}
							>
								{!showFilter && (
									<button
										className="btn bg-none text-light d-md-none d-sm-inline-block"
										onClick={showFilterHandler}
									>
										<FontAwesomeIcon icon={faFilter} className=" px-2" />
										Filter Auction
									</button>
								)}
							</div>

							{(data && status === 'completed') && (
								<ViewAuctionDetails AuctionData={data && data} animate={false} />
							)}
						</div>
					) : (
						<div className="pt-5">
							<NoData text="No Auctions Now" />
						</div>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default ViewAllAuctions;
