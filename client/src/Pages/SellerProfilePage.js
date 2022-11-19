import React from 'react';
import SellerProfile from '../component/Modules/SellerModule/sellerProfile/sellerProfile';
import { useLocation } from 'react-router-dom';
const SellerProfilePage = props => {
	const location = useLocation(Location);
	const SellerId = new URLSearchParams(location.search).get('id');
	return <SellerProfile sellerId={SellerId} />;
};
export default SellerProfilePage;
