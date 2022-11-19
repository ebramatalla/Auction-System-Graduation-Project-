import React, { useState, useEffect } from 'react';
import ModalUi from '../../../UI/Modal/modal';

import { useSelector } from 'react-redux';
import useHttp from '../../../../CustomHooks/useHttp';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm/index';
import { getWalletBalance } from '../../../../Api/BuyerApi';
import { useLocation } from 'react-router-dom';

import BuyerDashboardContent from '../BuyerDashboard';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';

const Wallet = props => {
	const stripePromise = loadStripe(
		process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
	);
	const [chargeWallet, setChargeWallet] = useState(false);
	const [ModalName, setModalName] = useState('Wallet');
	const [btnFooterStyle, setBtnFooterStyle] = useState('');

	const idToken = useSelector(store => store.AuthData.idToken);
	const { sendRequest, status, data } = useHttp(getWalletBalance);
	const [reloadBalance, setReloadBalance] = useState('');
	const [loading, setLoading] = useState(false);

	const location = useLocation().pathname === '/buyer-dashboard/chargeWallet';

	const reloadBalanceHandler = value => {
		setReloadBalance(value);
	};

	const chargeWalletHandler = () => {
		setChargeWallet(true);
		setModalName('Charge Wallet');
		setBtnFooterStyle('justify-content-start mx-2');
	};

	// get wallet balance
	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest, reloadBalance]);

	useEffect(() => {
		if (status === 'pending') {
			setLoading(true);
		}
	}, [status, reloadBalance]);

	useEffect(() => {
		if (status === 'completed' || status === 'error') {
			setLoading(false);
		}
	}, [status , reloadBalance]);

	const PaymentContent = (
		<>
			{!chargeWallet && (
				<div className="d-flex space-around w-100">
					<h4 className="fw-bold pt-2 px-4"> Your Balance </h4>
					<h4 className="px-1 pt-2 fw-bolder align-items-end text-end w-50 text-danger">
						{status === 'completed' && data && data.balance}{' '}
					</h4>
				</div>
			)}
			{chargeWallet && (
				<Elements stripe={stripePromise}>
					<PaymentForm />
				</Elements>
			)}
		</>
	);

	return (
		<>
			{loading && <LoadingSpinner></LoadingSpinner>}

			<ModalUi
				show={props.show}
				onHide={props.onHide}
				title={ModalName}
				body={PaymentContent}
				btnName={!chargeWallet && 'Charge Wallet'}
				btnHandler={!chargeWallet && chargeWalletHandler}
				btnFooterStyle={btnFooterStyle}
			/>

			{/* wallet on buyer dashboard */}
			{location && (
				<BuyerDashboardContent>
					<PageContent>
						<PageHeader text="Charge Wallet" showLink={false} />

						{/* start view balance */}
						<div className="BalanceCard mx-auto my-4 pt-4 d-flex flex-column justify-content-center bg-dark text-light text-center rounded-3">
							<h5 className="fw-bold pb-2"> Your Balance </h5>
							<h5 className="bg-primary py-2 m-0">
								{status === 'completed' && data && data.balance}
							</h5>
						</div>
						{/* end view balance */}

						{/* start Payment form */}
						<Elements stripe={stripePromise}>
							<PaymentForm
								className="px-5 pt-3"
								showAllBtns={true}
								onReload={reloadBalanceHandler}
							/>
						</Elements>
						{/* end Payment form */}
					</PageContent>
				</BuyerDashboardContent>
			)}
		</>
	);
};

export default Wallet;
