import React from 'react';

import classes from './sidebar.module.css';
import Dropdown from '../UI/Dropdown';
import { faGavel, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Sidebar = props => {
	const userData = props.userData && props.userData;
	let user = props.sidebarContent;
	const userName = Object.keys(user)[0];

	return (
		<React.Fragment>
			<div
				className={`${classes.sidebar} position-relative animation-from-left `}
			>
				<div className={`${classes.logo}  text-center `}>
					<Link
						to="/home-page"
						className="text-light  mt-3 fw-bolder text-decoration-none "
					>
						<h2>
							On<span>Line Auction</span>
						</h2>
					</Link>
				</div>

				<div className={classes.adminName}>
					{userData && userData.image ? (
						<img
							className={`rounded-circle ${classes.adminImg}`}
							src={
								userData.image &&
								userData.image.url &&
								`${userData['image']['url']}`
							}
							alt="userImage"
						/>
					) : (
						<div className={classes.img}>
							<FontAwesomeIcon
								icon={faUser}
								className={` ${classes.adminIcon} rounded-circle mt-2 `}
							/>
						</div>
					)}

					<div className={classes.username}>
						{user[userName].list ? (
							<Dropdown
								username={user[userName].name}
								list={user[userName].list}
								id="admin"
							/>
						) : (
							<Link to={user[userName].path}>
								<h5 className="text-light fw-bold text-decoration-none">
									{userData && userData.name}
								</h5>
							</Link>
						)}
					</div>
				</div>
				<ul>
					{delete user[userName]}
					{Object.entries(user).map((user, index) => {
						return (
							<li key={index}>
								<Dropdown
									username={user[1].name}
									list={user[1].list}
									id={`auctions_${index}`}
									icon={user[1].icon ? user[1].icon : faGavel}
									className={user[1].class ? user[1].class : 'text-primary'}
								/>
							</li>
						);
					})}
				</ul>
			</div>
		</React.Fragment>
	);
};
export default Sidebar;
