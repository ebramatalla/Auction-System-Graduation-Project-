import React, { useEffect, useState } from 'react';
// toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// end toast
import { useSelector } from 'react-redux';
import useHttp from '../../../../../CustomHooks/useHttp';
import { getEmployees, remove } from '../../../../../Api/Admin';
import useFilter from '../../../../UI/TableLayout/FilteringTable/filter';
import DataTable from 'react-data-table-component';
import AdminDashboard from '../../home/adminDashboard';
import PageContent from '../../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../../UI/Page Header/pageHeader';
import './allEmployees.css';
// import { Link } from 'react-router-dom';

// font
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ModalUi from './../../../../UI/Modal/modal';

const ListAllEmployees = props => {
	// handle modal
	const [employeeId, setEmployeeId] = useState('');

	const [ModalShow, setModalShow] = useState(false);

	// const [ModalTitle, setModalTitle] = useState(
	// 	'Are you sure to Delete this employee?',
	// );
	// const [ModalBtn, setModalBtn] = useState('Confirm');
	let ModalBtn = 'Confirm'
	let ModalTitle = 'Are you sure to Delete this employee?'
	// *******************************************************
	const idToken = useSelector(store => store.AuthData.idToken);
	const [reloadData, setReloadData] = useState('');

	const { sendRequest, data } = useHttp(getEmployees);

	const {
		sendRequest: sendRequestForRemove,
		status: statusForRemove,
	} = useHttp(remove);

	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest, reloadData]);

	const removeHandler = employeeId => {
		sendRequestForRemove({
			path: `employee/${employeeId}`,
			accessToken: idToken,
		});
		setReloadData(employeeId);
	};

	useEffect(() => {
		if (statusForRemove === 'completed') {
			toast.success('Deleted Successfully 💖🐱‍👤');
			setModalShow(false);
		}
	}, [statusForRemove, reloadData]);

	const columns = [
		{
			name: 'Name',
			selector: row => row.name,
			sortable: true,
			center: true,
		},
		{
			name: 'E-mail',
			selector: row => row.email,
			center: true,
		},
		{
			name: 'Role',
			selector: row => row.role,
			center: true,
		},
		{
			name: 'Actions',
			selector: row => row.action,
			center: true,

			cell: props => {
				return (
					<>
						<button
							className="btn bg-danger my-2 "
							onClick={() => showModel(props._id)}
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					</>
				);
			},
		},
	];

	const showModel = employee_Id => {
		setEmployeeId(employee_Id);
		setModalShow(true);
	};

	//filter
	const items = data ? data : [];
	const { filterFun, filteredItems } = useFilter(items, 'name');
	//end filter

	// const failed = status !== 'completed';

	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
					<PageHeader text="Employees" showLink={false} />
					<ToastContainer theme="dark" />
					{data && (
						<DataTable
							// selectableRows
							columns={columns}
							data={filteredItems}
							subHeader
							subHeaderComponent={filterFun}
							theme="dark"
							pagination
						/>
					)}
					{ModalShow && (
						<ModalUi
							show={ModalShow}
							onHide={() => setModalShow(false)}
							btnHandler={() => removeHandler(employeeId)}
							title={ModalTitle}
							btnName={ModalBtn}
						/>
					)}
				</PageContent>
			</AdminDashboard>
		</React.Fragment>
	);
};

export default ListAllEmployees;
