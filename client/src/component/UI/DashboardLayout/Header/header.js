import React from 'react';
import { AuthDataActions } from '../../../../store/slices/RegisterSlices/AuthData';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import classes from './header.module.css';

// import icons and img
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
// import adminImg from '../../../../assets/icons8-test-account-40.png';

const Header = props => {
	const userData =props.userData && props.userData;
	const role = useSelector(store => store.AuthData.role);
	// start get pathname to put it in link of chat icon
	const location = useLocation();
	const pathname = location.pathname;
	const pathnameParts = pathname.split('/').filter(Boolean);
	const expectedResults = pathnameParts[0];
	// end get pathname
	const navClasses = !props.showSideBarValue ? 'w-100' : classes.headerNav;
	const dispatch = useDispatch();

	const logoutHandler = () => {
		dispatch(AuthDataActions.logout());
	};
	return (
		<nav
			className={`navbar navbar-light bg-black  p-2 ${navClasses} fixed-top `}
		>
			<div className="container-fluid m-0 p-0 ">
				{/* <div className='d-flex justify-content-between'></div> */}
				<div className="d-flex">
					<button onClick={props.toggleSidebar} className={classes.barBtn}>
						<FontAwesomeIcon icon={faBars} />
					</button>
				</div>
				<div className=" text-light px-2">
					{role !== 'admin' && (
						<Link to={`/${expectedResults}/chat`} className="text-light">
							<FontAwesomeIcon
								icon={faMessage}
								className={classes.MessgaeIcon}
							/>
						</Link>
					)}{' '}
					<span className={classes.bar}></span>
					{/* Notification Icon */}
					<div className="d-inline-block">
						<FontAwesomeIcon
							icon={faBell}
							className={classes.NotificationIcon}
						/>
						<span
							className={`position-absolute translate-middle bg-danger rounded-circle ${classes.NotificationBadge}`}
						>
							<span className={classes.NotificationNum}> 3 </span>
						</span>
					</div>
					{userData && userData.image ? (
						<img
							className={`rounded-circle ${classes.adminImg}`}
							src={
								userData.image &&
								userData.image.url &&
								`${userData['image']['url']}`
							}
							alt ="userImage"
						/>
					) : (
						<FontAwesomeIcon
							icon={faUser}
							className={` ${classes.adminIcon} rounded-circle mt-3 `}
						/>
					)}
					<Link
						to="/home-page"
						className={`${classes.logout} mx-2 `}
						onClick={logoutHandler}
					>
						Logout
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Header;
