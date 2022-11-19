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

const BlockModal = ({ id, show, onHide, isBlocked, onReload }) => {
	const accessToken = useSelector(store => store.AuthData.idToken);
	const [SelectedBlockMessage, setSelectedBlockMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const {
		sendRequest: sendRequestForBlockUser,
		status: statusForBlockUser,
		data: dataForBlockUser,
		error: errorForBlockUser,
	} = useHttp(Warn_Or_Block_User);
	const {
		sendRequest: sendRequestForRemoveBlocking,
		status: statusForRemoveBlocking,
		data: dataForRemoveBlocking,
		error: errorForRemoveBlocking,
	} = useHttp(Remove_Warning_Or_Blocking_Badge);

	const { sendRequest, status, data } = useHttp(getReasons);

	const BlockTitle = isBlocked ? 'Remove Block Badge' : 'Block User';

	// start get all Blocking reasons
	useEffect(() => {
		const Type = 'Block';
		sendRequest({ accessToken, Type });
	}, [sendRequest]);

	// end get all Blocking reasons

	// start Block user handler
	const BlockUserHandler = () => {
		if (!isBlocked) {
			setLoading(true);
			const SelectedMessage_ = {
				blockReason: SelectedBlockMessage ? SelectedBlockMessage : data[0],
			};
			const Type = 'Block';
			sendRequestForBlockUser({ accessToken, id, SelectedMessage_, Type });
		} else {
			setLoading(true);
			const Type = 'Block';
			sendRequestForRemoveBlocking({ accessToken, id, Type });
		}
	};

	useEffect(() => {
		if (statusForBlockUser === 'completed') {
			setLoading(false);
			toast.success(dataForBlockUser.message);
			onReload(Math.random());
			onHide();
		}
	}, [statusForBlockUser, show]);

	useEffect(() => {
		if (statusForRemoveBlocking === 'completed') {
			setLoading(false);
			toast.success(dataForRemoveBlocking.message);
			onReload(Math.random());
			onHide();
		}
	}, [statusForRemoveBlocking, show]);

	useEffect(() => {
		if (statusForRemoveBlocking === 'error' || statusForBlockUser === 'error') {
			setLoading(false);
			toast.error(errorForRemoveBlocking || errorForBlockUser);
			onHide();
		}
	}, [statusForRemoveBlocking, statusForBlockUser, show]);

	// end Block user handler

	// start view Block Reasons
	const ViewAllReasons =
		data && status === 'completed' && data.length > 0 ? (
			data.map((reason, index) => (
				<option key={index} value={reason}>
					{' '}
					{reason}{' '}
				</option>
			))
		) : (
			<option className="bg-danger"> No Reasons </option>
		);

	const BlockReasons = !isBlocked ? (
		<select
			className="BlockReasons"
			onChange={e => setSelectedBlockMessage(e.target.value)}
		>
			{ViewAllReasons}
		</select>
	) : (
		<h6 className="fw-bold">
			{' '}
			Are You Sure from Removing Blocking Badge from this user
		</h6>
	);

	// end view Block Reasons

	return (
		<>
			{loading && <LoadingSpinner />}

			<ModalUi
				show={show}
				onHide={onHide}
				title={BlockTitle}
				body={BlockReasons}
				btnName={!isBlocked ? 'Submit' : 'Yes'}
				btnHandler={BlockUserHandler}
			/>
		</>
	);
};

export default BlockModal;
