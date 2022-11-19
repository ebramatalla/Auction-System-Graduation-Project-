import React, { Fragment, useEffect } from 'react';

import { getOnGoingAuctions } from '../../../Api/AuctionsApi';
import ViewAuctionDetails from '../../UI/ViewAuctionDetails/ViewAuctionDetails';
import useHttp from '../../../CustomHooks/useHttp';

import classes from './OnGoingAuctions.module.css';

import NoData from '../../UI/NoData';
import PageHeader from '../../UI/Page Header/pageHeader';

const OnGoingAuctions = () => {
	const { sendRequest, status, data, error } = useHttp(getOnGoingAuctions);
	const FirstThreeItems = data && data.slice(0, 3);

	useEffect(() => {
		sendRequest();
	}, [sendRequest]);

	return (
		<Fragment>
			<div className={`${classes.CurrentAuctions} container-fluid`}>
				<PageHeader text="OnGoing  Auctions" showLink={true} filterText='ongoing'/>
				{data && status === 'completed' && data.length > 0 && (
					<ViewAuctionDetails AuctionData={FirstThreeItems} />
				)}

				<NoData
					text="No On Going Auctions Now"
					data={data && data}
					error={error && error}
				/>
			</div>
		</Fragment>
	);
};

export default OnGoingAuctions;
