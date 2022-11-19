import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useHttp from '../../../../CustomHooks/useHttp';
import moment from 'moment';
import { getAllAuctions } from '../../../../Api/AuctionsApi';
import SellerDashboardContent from '../SellerModule';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import DataTable from 'react-data-table-component';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';

const ViewAllAuctions = () => {
	const { sendRequest, status: statusForGet, data } = useHttp(getAllAuctions);
	useEffect(() => {
		sendRequest();
	}, [sendRequest]);
	const [myAuctions, setMyAuctions] = useState([]);
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

			setMyAuctions(data);
		}
	}, [statusForGet]);

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
		},
		{
			name: 'Seller',
			selector: row => row.seller.name,
			center: true,
		},
		{
			name: 'Status',
			selector: row => row.status,
			center: true,
		},
		{
			name: 'Winner',
			selector: row => row.winningBuyer,
			center: true,
			cell: props => {
				return props.winningBuyer ? (
					<span>{props.winningBuyer.name}</span>
				) : (
					<span>No winner</span>
				);
			},
		},
		{
			name: 'Actions',
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
	//filter
	const items = myAuctions ? myAuctions : [];
	const { filterFun, filteredItems } = useFilter(items, 'title');
	//end filter

	return (
		<React.Fragment>
			<SellerDashboardContent>
				<PageContent>
					<PageHeader text="My Auctions" showLink={false} />{' '}
					{myAuctions && (
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
			</SellerDashboardContent>
		</React.Fragment>
	);
};

export default ViewAllAuctions;
