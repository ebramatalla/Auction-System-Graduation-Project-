import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';
import ModalUi from '../../../UI/Modal/modal';

const RecoverMoney = props => {
	const [ModalTitle, setModalTitle] = useState('Refund transaction amount?');
	const [btnName, setBtnName] = useState('Recover Money');

	const idToken = useSelector(store => store.AuthData.idToken);

	const [loading, setLoading] = useState(false);

	const RecoverMoneyHandler = async () => {
		setLoading(true);
		const paymentIntentId = props.PaymentIntentId;

		const { success, message } = await fetch(
			`${process.env.REACT_APP_API_URL}/wallet/refund?paymentIntentId=${paymentIntentId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`,
				},
			},
		).then(res => res.json());

		if (success === true) {
			setLoading(false);
			setModalTitle(message);
			props.onReload(Math.random());
			props.onHide();
		} else {
			setLoading(false);
			setModalTitle(message);
			setBtnName('');
			return;
		}
	};

	return (
		<>
			{loading && <LoadingSpinner />}
			<ModalUi
				show={props.show}
				onHide={props.onHide}
				title={ModalTitle}
				btnName={btnName}
				btnHandler={RecoverMoneyHandler}
				onReload={props.onReload}
			/>
		</>
	);
};

export default RecoverMoney;
