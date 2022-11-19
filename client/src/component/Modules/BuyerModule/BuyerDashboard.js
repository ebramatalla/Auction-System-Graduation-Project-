import React from 'react';
import DashboardLayout from '../../UI/DashboardLayout/DashboardLayout';

import {
	faCoins,
	faCommentDots,
	faCreditCardAlt,
	faGavel,
} from '@fortawesome/free-solid-svg-icons';
import PageProfile from '../../UI/PageProfile/PageProfile';
import PageContent from '../../UI/DashboardLayout/Pagecontant/pageContent';

const BuyerDashboardContent = props => {
	const email = localStorage.getItem('email');

	const dropdownListProfile = [
		{
			title: 'Edit Account',
			icon: faGavel,
			path: '/buyer-dashboard/UpdateAccount',
		},
	];

	const dropdownListViewAuctions = [
		{
			title: 'View Saved Auctions',
			icon: faGavel,
			path: '/buyer-dashboard/saved-auctions',
		},
		{
			title: 'View Participating Auctions',
			icon: faGavel,
			path: '/buyer-dashboard/joinedAuctions',
		},
	];

	const dropdownListChat = [
		{
			title: 'View Chats',
			icon: faCommentDots,
			path: '/buyer-dashboard/chat',
		},
	];

	const dropdownListPayment = [
		{
			title: 'Charge Wallet ',
			icon: faCoins,
			path: '/buyer-dashboard/chargeWallet',
		},
		{
			title: 'Display Wallet Transactions',
			icon: faCreditCardAlt,
			path: '/buyer-dashboard/viewWalletTransaction',
		},
	];
	const contentExist = props.children;
	return (
		<>
			<DashboardLayout
				buyer={{ name: `${email}` }}
				profile={{ name: 'Profile', list: dropdownListProfile }}
				viewAuctions={{ name: 'View Auctions', list: dropdownListViewAuctions }}
				chat={{ name: 'Chat', list: dropdownListChat }}
				payment={{ name: 'Payment', list: dropdownListPayment }}
			>
				{contentExist ? (
					props.children
				) : (
					<PageContent>
						<PageProfile />
					</PageContent>
				)}
			</DashboardLayout>
		</>
	);
};

export default BuyerDashboardContent;
