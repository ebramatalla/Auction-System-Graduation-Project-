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
			status: 'upcoming',
		});
	}, [sendRequest]);
	const [upcomingData, setUpcomingData] = useState([]);
	useEffect(() => {
		if (status === 'completed') {
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

			setUpcomingData(data);
		}
	}, [status]);

	//filter
	const items = upcomingData ? upcomingData : [];
	const { filterFun, filteredItems } = useFilter(items, 'title');

	//end filter
	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
					<PageHeader text="Upcoming Auctions" showLink={false} />{' '}
					{upcomingData && (
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
