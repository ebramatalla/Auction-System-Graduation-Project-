import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useHttp from '../../../../CustomHooks/useHttp';
import { getUsers } from '../../../../Api/usersApi';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import DataTable from 'react-data-table-component';
import AdminDashboard from '../home/adminDashboard';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import './users.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const UsersPage = () => {
	const idToken = useSelector(store => store.AuthData.idToken);
	const columns = [
		{
			name: 'Name',
			selector: row => row.name,
			sortable: true,
			cell: props => {
				return (
					<div>
						{props.image ? (
							<img
								src={props.image && props.image.url}
								alt="sellerImage"
								className="rounded-circle d-inline-block "
								style={{ width: '45px', height: '45px', marginRight: '10px' }}
								// alt="Buyer Image"
							></img>
						) : (
							// <p className="text-danger">No img</p>
							<span className={`rounded-circle noImage`}
							style={{ width: '45px', height: '45px', marginRight: '10px' }}
							>
								<FontAwesomeIcon icon={faUser}/>
							</span>

						)}

						<p className="text-light d-inline-block">{props.name}</p>
					</div>
				);
			},
		},

		{
			name: 'E-mail',
			selector: row => row.email,
		},
		{
			name: 'Phone',
			selector: row => row.phoneNumber,
			center: true,
			cell: props => {
				return (
					<div>
						{props.phoneNumber ? (
							<span className="text-light">{props.phoneNumber}</span>
						) : (
							<span className="text-light">NA</span>
						)}
					</div>
				);
			},
		},
		{
			name: 'National ID',
			selector: row => row.nationalID,
			center: true,
			cell: props => {
				return (
					<div>
						{props.nationalID ? (
							<span className="text-light">{props.nationalID}</span>
						) : (
							<span className="text-light">NA</span>
						)}
					</div>
				);
			},
		},
		{
			name: 'Actions',
			selector: row => row.action,
			cell: props => {
				return (
					<span className="text-info">
						{/*  props._id */}
						<Link to={`/seller?id=${props._id}`}>User Profile</Link>
					</span>
				);
			},
		},
	];

	const { sendRequest, data } = useHttp(getUsers);

	useEffect(() => {
		sendRequest({
			idToken: idToken,
			path: 'admin/users?role=seller',
		});
	}, [sendRequest]);

	//filter
	const items = data ? data : [];
	const { filterFun, filteredItems } = useFilter(items, 'name');
	//end filter

	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
					<PageHeader text="Sellers" showLink={false} />{' '}
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
				</PageContent>
			</AdminDashboard>
		</React.Fragment>
	);
};

export default UsersPage;
