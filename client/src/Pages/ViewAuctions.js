import React, { Fragment } from 'react';

import ViewCurrentAuction from '../component/Auctions/ViewCurrentAuction/ViewCurrentAuction';
import ViewAllAuctions from '../component/Auctions/ViewAuctions/ViewAllAuction';
import { useLocation } from 'react-router-dom';

function ViewAuctions() {
	const location = useLocation();
	const AuctionId = new URLSearchParams(location.search).get('id');
	const AuctionStatus = new URLSearchParams(location.search).get('status');

	return (
		<Fragment>
			{AuctionId && <ViewCurrentAuction />}
			{!AuctionId && <ViewAllAuctions AuctionStatus = {AuctionStatus}/>}
		</Fragment>
	);
}

export default ViewAuctions;
