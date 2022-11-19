import React, { useEffect, useState } from 'react';
import moment from 'moment';

import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import useHttp from '../../../../CustomHooks/useHttp';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import '../../EmployeesModule/ExtendTimeRequests/extend.css';
import ModalUi from '../../../UI/Modal/modal';
import SellerDashboardContent from '../SellerModule';
import { GetExtensionRequest } from '../../../../Api/SellerApi';

function SellerExtendAuctions() {
	const idToken = useSelector(store => store.AuthData.idToken);
	const [isShownRejectModal, setIsShownRejectModal] = useState(false);
	const [RejectionMessage, setRejectionMessage] = useState('');

	const { sendRequest, status, data } = useHttp(GetExtensionRequest);

	// get request for all extend time requests
	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest]);

	useEffect(() => {
		if (status === 'completed') {
			let newExtensionTime ;

			data.map(data =>  {
			return (
				newExtensionTime =
					data.extensionTime.days +
					' d ' +
					' - ' +
					data.extensionTime.hours +
					'' +
					' h ' +
					' - ' +
					data.extensionTime.minutes +
					'' +
					' m ',
				data.extensionTime = { newExtensionTime }
			)
			});
		}
	}, [status]);

	//  end get request for all extend time requests

	const modalTitle = <h3> Reason For Rejection</h3>;
	const modalBody = (
		<>
			<h2 for="reason" className="text-light fw-bold">
				{RejectionMessage}
			</h2>
		</>
	);

	const showRejectModal = rejectionMessage => {
		setIsShownRejectModal(true);
		setRejectionMessage(rejectionMessage);
	};

	// end modal

	const columns = [
		{
			name: 'Auction Status',
			selector: row => row.status,
			sortable: true,
			center: true,
		},
		{
			name: 'Auction Details',
			selector: row => row.status,
			sortable: true,
			center: true,
			cell: props => {
				return (
					<Link
						to={`/auctions?id=${props._id}`}
						className=" text-decoration-none my-0 text-light"
					>
						Auction Details
					</Link>
				);
			},
		},
		{
			name: 'Request Status',
			selector: row => row.requestStatus,
			sortable: true,
			center: true,
		},

		{
			name: 'EndDate',
			selector: row => moment(row.endDate).format('LLL'),
			center: true,
			sortable: true,
		},
		{
			name: 'ExtensionTime',
			selector: row => row.extensionTime.newExtensionTime,
			center: true,
		},

		{
			name: 'Actions',
			center: true,
			cell: props => {
				return (
					<>
						{props.requestStatus === 'rejected' ? (
							<button
								className="btn btn-success mx-2"
								onClick={() => showRejectModal(props.rejectionMessage)}
							>
								<FontAwesomeIcon icon={faEnvelopeCircleCheck} />
							</button>
						) : (
							<span> ----- </span>
						)}
					</>
				);
			},
		},
	];
	//filter
	const items = data ? data : [];
	const { filterFun, filteredItems } = useFilter(items, 'status');
	//end filter

	return (
		<SellerDashboardContent>
			<PageContent>
				<ToastContainer theme="dark" />
				<PageHeader text="Extension Requests" showLink={false} />
				<DataTable
					columns={columns}
					data={filteredItems}
					subHeader
					subHeaderComponent={filterFun}
					theme="dark"
					pagination
				/>
				{isShownRejectModal && (
					<ModalUi
						show={isShownRejectModal}
						onHide={() => setIsShownRejectModal(false)}
						title={modalTitle}
						body={modalBody}
					/>
				)}
			</PageContent>
		</SellerDashboardContent>
	);
}

export default SellerExtendAuctions;
