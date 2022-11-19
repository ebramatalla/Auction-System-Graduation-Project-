import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import UserProfile from '../../../UI/UserProfile/profile';
import buyerImg from '../../../../assets/user.png';

const BuyerProfile = () => {
	const cardTitlesForBuyer = [
		{
			name: 'Joined Auctions',
			number: 10,
		},
	];
	const [buyerData, setBuyerData] = useState('');
	const url = 'http://localhost:8000';
	const idToken = useSelector(store => store.AuthData.idToken);
	useEffect(() => {
		const fetchBuyerData = async () => {
			const response = await fetch(`${url}/auth/profile`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			});
			const data = await response.json();
			setBuyerData(data);
		};
		fetchBuyerData();
	}, []);

	return (
		<UserProfile
			name={buyerData.name}
			email={buyerData.email}
			img={buyerImg}
			cards={cardTitlesForBuyer}
		/>
	);
};
export default BuyerProfile;
