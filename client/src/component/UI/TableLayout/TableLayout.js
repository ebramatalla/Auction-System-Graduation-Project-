import React from 'react';

import PageContent from '../DashboardLayout/Pagecontant/pageContent';
import AdminDashboard from '../../AdminModule/AdminDashboard/home/adminDashboard';
import classes from './table.module.css';

import { Link } from 'react-router-dom';
// import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const TableLayout = props => {
	const userActions =
		props.records.name && props.records.name.length !== 0
			? Object.keys(props.records.name[0])[1] === 'name'
			: '';

	const dataExist = props.records.name && props.records.name.length !== 0;
	return (
		<React.Fragment>
			<AdminDashboard>
				<PageContent>
					{props.failed && <p> failed to load</p>}
					{!props.failed && (
						<>
							<h1 className={`${classes.title} `}>{props.title}</h1>
							<div>
								{!dataExist && <p className="text-light">No data to show</p>}
								{dataExist && (
									<table
										className={`table table-dark table-sm  ${classes.usersTable}`}
									>
										<thead>
											<tr className="text-center">
												{props.columNames.map(name => (
													<td>{name}</td>
												))}
												<td>Actions</td>
											</tr>
										</thead>
										{/* <tbody> */}
										{props.records.name.map((record, index) => {
											return (
												<tr className="text-center" key={index}>
													{props.columNames.map(name => (
														<>
															{record[name] ? (
																name === 'seller' ? (
																	<td>{record[name]['name']}</td>
																) : (
																	<td>{record[name]}</td>
																)
															) : (
																<td>undefined</td>
															)}
														</>
													))}
													{record && userActions && (
														<Link to="#" className={`${classes.details} `}>
															UserProfile
														</Link>
													)}
													{!userActions && (
														<Link
															className={`${classes.details} `}
															to={`/auctions?id=${record['_id']}`}
														>
															More Details
														</Link>
													)}
												</tr>
											);
										})}
										{/* </tbody> */}
									</table>
								)}
							</div>
						</>
					)}
				</PageContent>
			</AdminDashboard>
		</React.Fragment>
	);
};

export default TableLayout;
