import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
	getReasons,
	Warn_Or_Block_User,
	Remove_Warning_Or_Blocking_Badge,
} from '../../../Api/Admin';
import useHttp from '../../../CustomHooks/useHttp';

import ModalUi from '../Modal/modal';
import LoadingSpinner from '../Loading/LoadingSpinner';
import './WarnModal.css';

const WarnModal = ({ id, show, onHide, isWarned, onReload }) => {
	const accessToken = useSelector(store => store.AuthData.idToken);
	const [SelectedWarnMessage, setSelectedWarnMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const { sendRequest, status, data } = useHttp(getReasons);
	const {
		sendRequest: sendRequestForWarnUser,
		status: statusForWarnUser,
		data: dataForWarnUser,
		error: errorForWarnUser,
	} = useHttp(Warn_Or_Block_User);
	const {
		sendRequest: sendRequestForRemoveWarning,
		status: statusForRemoveWarning,
		data: dataForRemoveWarning,
		error: errorForRemoveWarning,
	} = useHttp(Remove_Warning_Or_Blocking_Badge);

	const WarnTitle = isWarned ? 'Remove Warn Badge' : 'Warn User';

	// start get all warning reasons
	useEffect(() => {
		const Type = 'Warn';
		sendRequest({ accessToken, Type });
	}, [sendRequest]);

	// end get all warning reasons

	// start warn user handler
	const WarnUserHandler = () => {
		if (!isWarned) {
			setLoading(true);
			const SelectedMessage_ = {
				warningMessage: SelectedWarnMessage ? SelectedWarnMessage : data[0],
			};
			const Type = 'Warn';
			sendRequestForWarnUser({ accessToken, id, SelectedMessage_, Type });
		} else {
			setLoading(true);
			const Type = 'Warn';
			sendRequestForRemoveWarning({ accessToken, id, Type });
		}
	};

	useEffect(() => {
		if (statusForWarnUser === 'completed') {
			setLoading(false);
			toast.success(dataForWarnUser.message);
			onReload(Math.random());
			onHide();
		}
	}, [statusForWarnUser, show]);

	useEffect(() => {
		if (statusForRemoveWarning === 'completed') {
			setLoading(false);
			toast.success(dataForRemoveWarning.message);
			onReload(Math.random());
			onHide();
		}
	}, [statusForRemoveWarning, show]);

	useEffect(() => {
		if (statusForRemoveWarning === 'error' || statusForWarnUser === 'error') {
			setLoading(false);
			toast.error(errorForRemoveWarning || errorForWarnUser);
			// onReload(Math.random())
			onHide();
		}
	}, [statusForRemoveWarning, statusForWarnUser, show]);
	// end warn user handler

	// start view Warn Reasons
	const ViewAllReasons =
		data &&
		status === 'completed' &&
		data.map((reason, index) => (
			<option key={index} value={reason}>
				{' '}
				{reason}{' '}
			</option>
		));

	const WarnReasons = !isWarned ? (
		<select
			className="WarnReasons"
			onChange={e => setSelectedWarnMessage(e.target.value)}
		>
			{ViewAllReasons}
		</select>
	) : (
		<h6 className="fw-bold text-center">
			{' '}
			Are You Sure from Removing Warning Badge from this user
		</h6>
	);

	// end view Warn Reasons

	return (
		<>
			{loading && <LoadingSpinner />}

			<ModalUi
				show={show}
				onHide={onHide}
				title={WarnTitle}
				body={WarnReasons}
				btnName={!isWarned ? 'Submit' : 'Yes'}
				btnHandler={WarnUserHandler}
				// btnFooterStyle={btnFooterStyle}
			/>
		</>
	);
};

export default WarnModal;
