import React from 'react';
import UpdateAccountForUsers from '../../UI/UpdateAccount/UpdateAccount';
import BuyerDashboardContent from './BuyerDashboard';

const UpdateAccountForBuyer = () => {
	return (
		<>
			<BuyerDashboardContent>
				<UpdateAccountForUsers />
			</BuyerDashboardContent>
		</>
	);
};

export default UpdateAccountForBuyer;
