import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useHttp from '../../../../CustomHooks/useHttp';
import moment from 'moment';
import { getAllAuctions } from '../../../../Api/Admin';

import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import DataTable from 'react-data-table-component';
import AdminDashboard from '../home/adminDashboard';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';

const AllAuctions = () => {
	const idToken = useSelector(store => store.AuthData.idToken);

	const { sendRequest, status: statusForGet, data } = useHttp(
		getAllAuctions,
	);
	// ! to be removed

	useEffect(() => {
		sendRequest({ idToken });
	}, [sendRequest]);
	const [ongoingAuctions, setOngoingAuctions] = useState([]);
	useEffect(() => {
		if (statusForGet === 'completed') {
			//*Format dates
			let newStartDate
			let newEndDate
			data.map(data => {
				return (
					newStartDate = moment(data.startDate).format(' DD / MM / YYYY'),
					newEndDate = moment(data.endDate).format(' DD / MM / YYYY'),
					data.endDate ? data.endDate = newEndDate : data.endDate = <span>NA</span> ,
					data.startDate = newStartDate
				)});


			setOngoingAuctions(data);
		}
	}, [statusForGet]);

	const columns = [
		{
			name: 'Title',
			selector: row => row.title,
			sortable: true,
		},
		{
			name: 'Base Price',
			selector: row => row.basePrice,
		},
		{
			name: 'Start Date',
			selector: row => row.startDate,
		},
		{
			name: 'End Date',
			selector: row => row.endDate,
			center: true,
		},
		{
			name: 'Seller',
			selector: row => row.seller.name,
		},
		{
			name: 'Status',
			selector: row => row.status,
		},
		{
			name: 'Actions',
			// selector: row => row.action,
			cell: props => {
				return (
					<span className="text-info">
						<Link to={`/auctions?id=${props._id}`}>Auction Details</Link>
					</span>
				);
			},
		},
	];
	//filter
	const items = ongoingAuctions ? ongoingAuctions : [];
	const { filterFun, filteredItems } = useFilter(items, 'title');
	//end filter

	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
					<PageHeader text="All Auctions" showLink={false} />{' '}
					{ongoingAuctions && (
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

export default AllAuctions;
