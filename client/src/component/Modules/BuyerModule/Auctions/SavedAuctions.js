import React, { useEffect } from 'react';

import useHttp from '../../../../CustomHooks/useHttp';
import { viewSaveAuctionApi } from '../../../../Api/BuyerApi';

import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import ViewAuctionDetails from '../../../UI/ViewAuctionDetails/ViewAuctionDetails';
import PageHeader from '../../../UI/Page Header/pageHeader';
import NoData from '../../../UI/NoData';
import BuyerDashboardContent from '../BuyerDashboard';

import classes from './SavedAuction.module.css';
import { useSelector } from 'react-redux';
import { getProfileData } from '../../../../Api/Admin';

const SavedAuctions = () => {
	const idToken = useSelector(store => store.AuthData.idToken);
	const { sendRequest, status, data, error } = useHttp(viewSaveAuctionApi);
	const {
		data: dataForProfile,
		sendRequest: sendRequestForProfile,
		status: statusForProfile
	} = useHttp(getProfileData);
	useEffect(() => {
		sendRequestForProfile(idToken);
	}, [sendRequestForProfile]);

	useEffect(() => {
		const buyerId = dataForProfile && dataForProfile._id;
		if (statusForProfile === 'completed') {
			sendRequest({ idToken, buyerId: buyerId && buyerId });
		}
	}, [sendRequest, statusForProfile]);

	return (
		<BuyerDashboardContent>
			<PageContent className={classes.SavedAuction}>
				<PageHeader text="View Saved Auctions" />
				<div className="p-4">
					{data && status === 'completed' && (
						<ViewAuctionDetails
							AuctionData={data && data.savedAuctions}
							lg={5}
							animate={false}
						/>
					)}
					<NoData
						text={'No Saved Auctions now '}
						data={data && data.savedAuctions}
						error={error}
					></NoData>
				</div>
			</PageContent>
		</BuyerDashboardContent>
	);
};

export default SavedAuctions;
