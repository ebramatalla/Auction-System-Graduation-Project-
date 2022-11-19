import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useHttp from '../../../../CustomHooks/useHttp';
import { getAllAuctions } from '../../../../Api/Admin';
import PageHeader from '../../../UI/Page Header/pageHeader';
import AdminDashboard from '../home/adminDashboard';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import DataTable from 'react-data-table-component';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';

const PendingAuctions = () => {
	const idToken = useSelector(store => store.AuthData.idToken);

	const { sendRequest, status, data } = useHttp(getAllAuctions);

	// columns
	const columns = [
		{
			name: 'Title',
			selector: row => row.title,
			sortable: true,
			center: true,
		},
		{
			name: 'Base Price',
			selector: row => row.basePrice,
			sortable: true,
			center: true,
		},
		{
			name: 'Start Date',
			selector: row => row.startDate,
			center: true,
		},
		{
			name: 'End Date',
			selector: row => row.endDate,
			center: true,
			cell: props => {
				return <span className="text-light">NA</span>;
			},
		},
		{
			name: 'Seller',
			center: true,

			selector: row => row.seller.name,
		},
		{
			name: 'Status',
			selector: row => row.status,
			center: true,
		},
		{
			name: 'Actions',
			// selector: row => row.action,
			center: true,

			cell: props => {
				return (
					<span className="text-info">
						<Link to={`/auctions?id=${props._id}`}>Auction Details</Link>
					</span>
				);
			},
		},
	];
	useEffect(() => {
		sendRequest({
			idToken: idToken,
			status: 'pending',
		});
	}, [sendRequest]);
	const [pendingData, setPendingData] = useState([]);
	useEffect(() => {
		if (status === 'completed') {
			let newDate
			data.map(data => {return (
				newDate = moment(data.startDate).format(' DD / MM / YYYY'),
				data.startDate = newDate
			)});
			setPendingData(data);
		}
	}, [status]);

	//filter
	const items = pendingData ? pendingData : [];
	const { filterFun, filteredItems } = useFilter(items, 'title');

	//end filter
	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
					<PageHeader text="Pending Auctions" showLink={false} />{' '}
					{pendingData && (
						<DataTable
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

export default PendingAuctions;
