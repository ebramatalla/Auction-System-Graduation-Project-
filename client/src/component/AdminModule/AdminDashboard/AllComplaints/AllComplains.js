import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getAllComplaintsInSystem } from '../../../../Api/Admin';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import AdminDashboard from '../home/adminDashboard';
import useHttp from '../../../../CustomHooks/useHttp';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEnvelope,
	faEnvelopeOpen,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ComplaintModal } from './ComplaintsModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';

// start component

const AllComplaintsInSystem = () => {
	const url = 'http://localhost:8000';

	const idToken = useSelector(store => store.AuthData.idToken);
	const [isShownComplaintModal, setIsShownComplaintModal] = useState(false);
	const [reload, setReload] = useState('');

	const [complaintReason, setComplaintReason] = useState('');
	const [loading , setLoading] = useState(false)
	const { sendRequest, status: statusForGet, data } = useHttp(
		getAllComplaintsInSystem,
	);

	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest, reload]);
	const [complaints, setComplaints] = useState([]);
	useEffect(() => {
		if (statusForGet === 'completed') {
			//*Format dates
			let newDate
			data.map(data => {
				return(
					newDate = moment(data.createdAt).format(
						' ddd DD / MM [at] hh:mm a',
					),
					data.createdAt = newDate
				)
			});

			setComplaints(data);
		}
	}, [statusForGet]);
	// handle ComplaintModal
	const ComplaintHandler = (id, reason, status) => {
		setComplaintReason(reason && reason);

		//* Display the modal
		setIsShownComplaintModal(true);

		if (!status) {
			//* Send request to change read property
			MarkAsRead(id);
			// setReload(Math.random());
		}
		// setReload(Math.random());
	};

	// handle read
	const MarkAsRead = complaintId => {
		setLoading(true)
		fetch(`${url}/admin/complaints/${complaintId}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'content-type': 'application/json',
			},
		}).then(response => {
			if (!response.ok) {
				setLoading(false)
				return;
			}
			toast.success('New complaint marked as read by admin ✔✔')
			setLoading(false)
			const timer = setTimeout(()=>{
				window.location.reload()
			},2000)
			return () => clearTimeout(timer)
		});
	};
	const deleteComplaint = complaintId => {
		setLoading(true)

		fetch(`${url}/admin/complaints/${complaintId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${idToken}`,
				'content-type': 'application/json',
			},
		}).then(response => {
			if (!response.ok) {
				setLoading(false)
				return;
			}
			toast.success('Deleted Successfully 💖🐱‍👤');
			setReload(Math.random());
			setLoading(false)
			const timer = setTimeout(()=>{
				window.location.reload()
			},2000)
			return () => clearTimeout(timer)
		});
	};

	const columns = [
		{
			name: 'From',
			selector: row => row.from,
			sortable: true,
			center: true,
		},

		{
			name: 'Date',
			selector: row => row.createdAt,
			center: true,
			sortable: true,
		},
		{
			name: 'Reason',
			selector: row => row.reason,
			center: true,
			cell: props => {
				return (
					<span className="text-info">
						<button
							className="btn text-light  btn_read"
							onClick={() =>
								ComplaintHandler(props._id, props.reason, props.markedAsRead)
							}
						>
							Read
						</button>
					</span>
				);
			},
		},
		{
			name: 'Status',
			center: true,
			sortable: true,
			cell: props => {
				return (
					<span className="text-info">
						{props.markedAsRead ? (
							<button className="btn btn-success" disabled>
								<FontAwesomeIcon icon={faEnvelopeOpen} />
							</button>
						) : (
							<button className="btn btn-success">
								<FontAwesomeIcon icon={faEnvelope} />
							</button>
						)}
					</span>
				);
			},
		},
		{
			name: 'Actions',
			center: true,
			cell: props => {
				return (
					<>
						<button
							className="btn bg-danger my-2 "
							onClick={() => deleteComplaint(props._id)}
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					</>
				);
			},
		},
	];
	//filter
	const items = complaints ? complaints : [];
	const { filterFun, filteredItems } = useFilter(items, 'name');
	//end filter

	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
				{loading && <LoadingSpinner /> }
					<ToastContainer theme="dark" />
					<PageHeader text="Complaints" showLink={false} />{' '}
					<DataTable
						columns={columns}
						data={filteredItems}
						subHeader
						subHeaderComponent={filterFun}
						theme="dark"
						pagination
					/>
					{isShownComplaintModal && (
						<ComplaintModal
							show={isShownComplaintModal}
							onHide={() => setIsShownComplaintModal(false)}
							complaintReason={complaintReason && complaintReason}
							onReload={value => setReload(value)}
						/>
					)}
				</PageContent>
			</AdminDashboard>
		</React.Fragment>
	);
};
export default AllComplaintsInSystem;
