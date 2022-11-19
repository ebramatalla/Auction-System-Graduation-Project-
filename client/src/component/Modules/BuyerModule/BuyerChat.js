import React from 'react';
import { useLocation } from 'react-router-dom';
import Chat from '../../UI/Chat/Chat';

import BuyerDashboardContent from './BuyerDashboard';

const BuyerChat = () => {
	const location = useLocation();
	const Email = new URLSearchParams(location.search).get('email');

	return (
		<BuyerDashboardContent>
			<Chat SellerEmail={Email && Email} />
		</BuyerDashboardContent>
	);
};

export default BuyerChat;
