import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import {
	ApproveExtend,
	getAllExtendTimeRequests,
	rejectExtend,
} from '../../../../Api/Admin';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import AdminDashboard from '../../../AdminModule/AdminDashboard/home/adminDashboard';
import useHttp from '../../../../CustomHooks/useHttp';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import './extend.css';
import ModalUi from '../../../UI/Modal/modal';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';
// start component

const ExtendTimeRequests = () => {
	const idToken = useSelector(store => store.AuthData.idToken);
	const [isShownRejectModal, setIsShownRejectModal] = useState(false);
	const [reload, setReload] = useState('');
	const [loading , setLoading] = useState(false)
	const { sendRequest, status: statusForGet, data } = useHttp(
		getAllExtendTimeRequests,
	);
	const {
		sendRequest: sendRequestForReject,
		status: statusForReject,
		error,
	} = useHttp(rejectExtend);
	const {
		sendRequest: sendRequestFoApprove,
		status: statusForApprove,
		error: errorForApprove,
	} = useHttp(ApproveExtend);

	// get request for all extend time requests
	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest, reload]);
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		if(statusForReject==='completed' || statusForReject === 'error' || statusForApprove==='completed' || statusForApprove === 'error'){
			setLoading(false)
		}

	}, [statusForReject , statusForApprove]);

	//  end get request for all extend time requests

	// handle reject modal
	const reasonRef = useRef();
	const [auctionId, setAuctionId] = useState('');
	const modalTitle = 'Reject Reason';
	const modalBody = (
		<>
			<label for="reason" className="text=light">
				Reason
			</label>

			<input
				type="text"
				ref={reasonRef}
				id="reason"
				className="form-control formInput"
			/>
		</>
	);

	const showRejectModal = id => {
		setIsShownRejectModal(true);
		setAuctionId(id);
	};

	// end modal
	const approveHandler = id => {
		setLoading(true)
		sendRequestFoApprove({ idToken, id });
		setReload(id);
	};
	const rejectHandler = id => {
		setLoading(true)
		const rejectionData = { message: reasonRef.current.value };
		sendRequestForReject({
			idToken: idToken,
			id: id,
			rejectionData: rejectionData,
		});
		setReload(id);
	};

	//
	useEffect(() => {
		if (statusForGet === 'completed') {
			//*Format dates
			let newDate , newExtensionTime
			data.map(data => {
				return (
					newDate = moment().to(data.endDate),
					data.endDate = newDate,
					newExtensionTime =
						data.extensionTime.days +
						' d ' +
						'' +
						data.extensionTime.hours +
						'' +
						' h' +
						'' +
						data.extensionTime.minutes +
						'' +
						'm',
					data.extensionTime = newExtensionTime
			)});

			setRequests(data);
		}
	}, [statusForGet]);

	useEffect(() => {
		if (!errorForApprove && statusForApprove === 'completed') {
			toast.success('Extend time request approved successfully');
			const timer = setTimeout(()=>{
				window.location.reload()
			} , 3000)
			return () => clearTimeout(timer)
		}
		else if(statusForApprove === 'error') {
			toast.error(errorForApprove);
		}
		setIsShownRejectModal(false);
	}, [statusForApprove]);

	useEffect(() => {
		if (!error && statusForReject === 'completed') {
			toast.success('Extend time request rejected successfully');
			const timer = setTimeout(()=>{
				window.location.reload()
			} , 3000)
			return () => clearTimeout(timer)
		}
		else if(statusForApprove === 'error') {
			toast.error(errorForApprove);

		}
		setIsShownRejectModal(false);
	}, [statusForReject, reload]);
	// table columns

	const columns = [
		{
			name: 'From',
			selector: row => row.seller.name,
			sortable: true,
			center: true,
			cell: props => {
				return (
					<Link
						to={`/seller?id=${props.seller._id}`}
						className=" text-decoration-none my-0"
					>
						{props.seller.name}
					</Link>
				);
			},
		},
		{
			name: 'Auction',
			selector: row => row._id,
			sortable: true,
			center: true,
			cell: props => {
				return (
					<Link
						to={`/auctions?id=${props._id}`}
						className=" text-decoration-none my-0"
					>
						AuctionDetails
					</Link>
				);
			},
		},

		{
			name: 'EndDate     ',
			selector: row => row.endDate,
			center: true,
			sortable: true,
		},
		{
			name: 'ExtensionTime',
			selector: row => row.extensionTime,
			center: true,
		},

		{
			name: 'Actions',
			center: true,
			cell: props => {
				return (
					<>
						<button
							className="btn btn-success mx-2"
							onClick={() => approveHandler(props._id)}
						>
							<FontAwesomeIcon icon={faCheck} />
						</button>
						<button
							className="btn bg-danger  "
							onClick={() => {
								return showRejectModal(props._id);
							}}
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					</>
				);
			},
		},
	];
	//filter
	const items = requests ? requests : [];
	const { filterFun, filteredItems } = useFilter(items, 'name');
	//end filter

	return (
		<React.Fragment>
			<AdminDashboard>
			{loading && <LoadingSpinner /> }
				<PageContent>
					<ToastContainer theme="dark" />
					<PageHeader text="Extend Requests" showLink={false} />{' '}
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
							btnName="Reject"
							btnHandler={() => rejectHandler(auctionId)}
							onReload={value => setReload(value)}
						/>
					)}
				</PageContent>
			</AdminDashboard>
		</React.Fragment>
	);
};
export default ExtendTimeRequests;
