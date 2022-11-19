import React  from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalUi from '../../../UI/Modal/modal';
import './complaint.css';

export const ComplaintModal = props => {
	const ComplaintTitle = 'Complaint Reason';
	const compliantBody = (
		<>
			<p className="text-light fw-bold">
				{props.complaintReason && props.complaintReason}
			</p>
		</>
	);
	return (
		<>
			<ToastContainer theme="dark" />

			<ModalUi
				show={props.show}
				onHide={props.onHide}
				title={ComplaintTitle}
				body={compliantBody}
			/>
		</>
	);
};
