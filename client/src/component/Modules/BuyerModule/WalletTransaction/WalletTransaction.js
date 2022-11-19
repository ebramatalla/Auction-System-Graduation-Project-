import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'react-bootstrap';

import DataTable from 'react-data-table-component';

import { useSelector } from 'react-redux';
import {
	getWalletBalance,
	getWalletTransactions,
} from '../../../../Api/BuyerApi';
import useHttp from '../../../../CustomHooks/useHttp';

import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';
import PageHeader from '../../../UI/Page Header/pageHeader';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';

import BuyerDashboardContent from '../BuyerDashboard';
import RecoverMoney from '../Payment/RecoverMoney';

const WalletTransaction = () => {
	// get num of withdraw transaction
	const [n_withdraw, setWithdrawNum] = useState('');
	const [n_deposit, setDepositNum] = useState('');

	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState('');

	const [showRecoverModal, setShowRecoverModal] = useState(false);
	const [paymentIntentId, setPaymentIntentId] = useState('');

	// get wallet balance
	const idToken = useSelector(store => store.AuthData.idToken);
	const { sendRequest, status, data } = useHttp(getWalletBalance);
	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest, reload]);
	// end get wallet balance

	// start get wallet Transactions
	const {
		sendRequest: sendRequestForWalletTrans,
		status: statusForWalletTrans,
		data: dataForWalletTrans,
	} = useHttp(getWalletTransactions);

	useEffect(() => {
		sendRequestForWalletTrans(idToken);
	}, [sendRequestForWalletTrans, reload]);

	useEffect(() => {
		if (status === 'pending') {
			setLoading(true);
		}
	}, [status]);

	useEffect(() => {
		if (statusForWalletTrans === 'completed') {
			setDepositNum(
				dataForWalletTrans.filter(trans => trans.transactionType === 'deposit')
					.length,
			);
			setWithdrawNum(
				dataForWalletTrans.filter(
					trans => trans.transactionType === 'withdrawal',
				).length,
			);
			setLoading(false);
		}
	}, [statusForWalletTrans, reload, dataForWalletTrans]);

	// end get wallet transaction

	const columns = [
		{
			name: 'Type',
			selector: row => row.transactionType.toUpperCase(),
			sortable: true,
		},
		{
			name: 'Amount',
			selector: row => row.amount,
			sortable: true,
		},
		{
			name: 'Date',
			selector: row =>
				moment(row.createdAt).format('ddd DD/MM [at] hh:mm:ss a'),
			sortable: true,
		},
		{
			name: 'Auction Assurance',
			selector: row => (row.isBlockAssuranceTransaction ? 'YES' : 'NO'),
			sortable: true,
			center: true,
		},
		{
			name: 'Actions',
			selector: row => row,
			cell: props => {
				return (
					<>
						{props.transactionType === 'deposit' && (
							<button
								className="btn bg-danger text-light my-2 "
								onClick={() => showRecoverModalHandler(props.paymentIntentId)}
							>
								<FontAwesomeIcon icon={faEdit} />
							</button>
						)}
					</>
				);
			},
		},
	];

	// start Recover money Handler
	const showRecoverModalHandler = value => {
		setPaymentIntentId(value);
		setShowRecoverModal(true);
	};
	const ReloadPageHandler = value => {
		setReload(value);
	};
	// end Recover money Handler

	//filter
	const items = dataForWalletTrans ? dataForWalletTrans : [];
	const { filterFun, filteredItems } = useFilter(items, 'transactionType');
	//end filter

	return (
		<BuyerDashboardContent>
			{loading && <LoadingSpinner></LoadingSpinner>}
			<PageContent>
				<PageHeader text="Wallet Transactions" showLink={false} />
				<Row className="w-100 p-0 m-0 px-3 mb-5">
					<Col lg="4">
						<div className="w-100 my-4 pt-4 d-flex flex-column justify-content-center bg-dark text-light text-center rounded-3">
							<h5 className="fw-bold pb-2"> Withdraw Transactions </h5>
							<h5 className="bg-danger py-2 m-0">
								{' '}
								{statusForWalletTrans === 'completed' &&
									dataForWalletTrans &&
									n_withdraw}{' '}
							</h5>
						</div>
					</Col>

					<Col lg="4">
						<div className="w-100 my-4 pt-4 d-flex flex-column justify-content-center bg-dark text-light text-center rounded-3">
							<h5 className="fw-bold pb-2"> Your Balance </h5>
							<h5 className="bg-primary py-2 m-0">
								{' '}
								{status === 'completed' && data && data.balance}{' '}
							</h5>
						</div>
					</Col>
					<Col lg="4">
						<div className="w-100 my-4 pt-4 d-flex flex-column justify-content-center bg-dark text-light text-center rounded-3">
							<h5 className="fw-bold pb-2"> Deposit Transactions</h5>
							<h5 className="bg-success py-2 m-0">
								{' '}
								{statusForWalletTrans === 'completed' &&
									dataForWalletTrans &&
									n_deposit}{' '}
							</h5>
						</div>
					</Col>
				</Row>

				{/* start show all transaction in table */}
				{dataForWalletTrans && (
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
				{/* end show all transaction in table */}

				{/* start change deposit transaction into withdrawal [recover money] */}
				{showRecoverModal && (
					<RecoverMoney
						PaymentIntentId={paymentIntentId}
						show={showRecoverModal}
						onHide={() => setShowRecoverModal(false)}
						onReload={ReloadPageHandler}
					/>
				)}
			</PageContent>
		</BuyerDashboardContent>
	);
};

export default WalletTransaction;
