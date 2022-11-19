import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useHttp from '../../../../CustomHooks/useHttp';
import { getUsers } from '../../../../Api/usersApi';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import DataTable from 'react-data-table-component';
import AdminDashboard from '../home/adminDashboard';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import PageHeader from '../../../UI/Page Header/pageHeader';
import {
	faBan,
	faCircleExclamation,
	faCircleXmark,
	faUser,
} from '@fortawesome/free-solid-svg-icons';

import BlockModal from '../../../UI/Modals/BlockModal';
import WarnModal from '../../../UI/Modals/WarnModal';
import { ToastContainer } from 'react-toastify';
import './users.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import JoinedAuctionModal from '../../../UI/Modals/JoinedAuctionModal';

const UsersPage = () => {
	const idToken = useSelector(store => store.AuthData.idToken);

	const [isShownWarnModal, setIsShownWarnModal] = useState(false);
	const [isWarned, setIsWarned] = useState(false);

	const [isShownBlockModal, setIsShownBlockModal] = useState(false);
	const [isBlocked, setIsBlocked] = useState(false);

	const [isShownJoinAuctions, setIsShownJoinAuctions] = useState(false);

	// reload users table when warn or block user
	const [reload, setReload] = useState('');

	const [userId, setUserId] = useState('');

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
								className="rounded-circle d-inline-block "
								style={{ width: '45px', height: '45px', marginRight: '10px' }}
								alt="Buyer"
							></img>
						) : (
							<span className={`rounded-circle noImage`}
							style={{ width: '45px', height: '45px', marginRight: '10px' }}
							>
								<FontAwesomeIcon icon={faUser}/>
							</span>
						)}

						<span className="text-light">{props.name}</span>
					</div>
				);
			},
		},

		{
			name: 'E-mail',
			selector: row => row.email,
			sortable: true,
		},
		{
			name: 'Phone',
			selector: row => row.phoneNumber,
			sortable: true,
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
			sortable: true,
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
					<div className="text-info btn-actions">
						<button
							type="button"
							className="btn btn-warn my-2 px-1 text-light "
							onClick={() => warnHandler(props._id, props.isWarned)}
						>
							{props.isWarned ? (
								<>
									<FontAwesomeIcon icon={faCircleXmark} className="px-1" />
									<span className="RemoveBadge">Remove Warn </span>
								</>
							) : (
								// btn show when user is not warned
								<>
									<FontAwesomeIcon
										icon={faCircleExclamation}
										className="pe-1"
									/>
									Warn
								</>
							)}
						</button>
						<button
							type="button"
							className="btn bg-danger my-2 text-light btn-block "
							onClick={() => blockHandler(props._id, props.isBlocked)}
						>
							{props.isBlocked ? (
								<>
									<FontAwesomeIcon icon={faCircleXmark} />
									<span className="RemoveBadge"> UnBlock </span>
								</>
							) : (
								// btn show when user is not Blocked
								<>
									<FontAwesomeIcon icon={faBan} className="pe-1" />
									Block
								</>
							)}
						</button>
					</div>
				);
			},
		},
	];

	const { sendRequest, data } = useHttp(getUsers);

	useEffect(() => {
		sendRequest({
			idToken: idToken,
			path: 'admin/users?role=buyer',
		});
	}, [sendRequest, reload]);

	// start warn handler
	const warnHandler = (id, isWarned) => {
		setUserId(id);
		setIsShownWarnModal(true);
		setIsWarned(isWarned);
	};
	// end warn handler

	// start block handler
	const blockHandler = (id, isBlocked) => {
		setUserId(id);
		setIsShownBlockModal(true);
		setIsBlocked(isBlocked);
	};
	// end block handler

	// start block handler
	// const joinAuctionsHandler = id => {
	// 	setUserId(id);
	// 	setIsShownJoinAuctions(true);
	// };
	// end block handler

	//filter
	const items = data ? data : [];
	const { filterFun, filteredItems } = useFilter(items, 'name');
	//end filter

	return (
		<React.Fragment>
			<AdminDashboard>
				{/* show successful message for warn or block user  */}
				<ToastContainer theme="dark" />

				<PageContent>
					<PageHeader text="Buyers" showLink={false} />
					{data && (
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

				{/* start warn modal */}
				{isShownWarnModal && (
					<WarnModal
						id={userId}
						show={isShownWarnModal}
						onHide={() => setIsShownWarnModal(false)}
						isWarned={isWarned}
						onReload={value => setReload(value)}
					/>
				)}
				{/* end warn modal */}

				{/* start Block modal */}
				{isShownBlockModal && (
					<BlockModal
						id={userId}
						show={isShownBlockModal}
						onHide={() => setIsShownBlockModal(false)}
						isBlocked={isBlocked}
						onReload={value => setReload(value)}
					/>
				)}
				{/* end Block modal */}

				{/* start Block modal */}
				{isShownJoinAuctions && (
					<JoinedAuctionModal
						buyerId={userId && userId}
						show={isShownJoinAuctions}
						onHide={() => setIsShownJoinAuctions(false)}
					/>
				)}
				{/* end Block modal */}
			</AdminDashboard>
		</React.Fragment>
	);
};

export default UsersPage;
