import React, { useEffect, useState } from 'react';
import UserProfile from '../../../UI/UserProfile/profile';
import buyerImg from '../../../../assets/user.png';
import { getProfileData } from '../../../UI/UserProfile/sellerProfileData';
import useHttp from '../../../../CustomHooks/useHttp';

const SellerProfile = props => {
	const { data, sendRequest } = useHttp(getProfileData);
	const [reload, setReload] = useState('');
	useEffect(() => {
		// sendRequest(props.sellerId);
		//TODO: To be updated
		sendRequest(props.sellerId);
	}, [sendRequest, reload]);


	return (
		<React.Fragment>
			<UserProfile
			data={data && data}
			seller={data && data.seller}
			name={data && data.seller.name}
			role={data && data.seller.role}
			auctions={data && data.auctions}
			reviews={data && data.reviews}
			img={buyerImg}
			onReload={value => setReload(value)}
		/>
		</React.Fragment>
		
	);
};
export default SellerProfile;
