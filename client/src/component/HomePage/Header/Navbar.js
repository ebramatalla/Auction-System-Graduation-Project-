import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowDown,
	faArrowUp,
	faBars,
	faUser,
} from '@fortawesome/free-solid-svg-icons';

import Categories from '../Categories/Categories';
import classes from './Navbar.module.css';
import DropDownBox from './DropDownBox';
import { Col, Row } from 'react-bootstrap';

const activeLink = navData =>
	`${navData.isActive ? classes.active : ''} fw-bold ${classes['navLink']} `;

const Navbar = props => {
	const isLoggedIn = useSelector(store => store.AuthData.isLoggedIn);

	const [isShownNavContent, setIsShownNavContent] = useState(false);
	const [isShownCategoriesContent, setIsShownCategoriesContent] = useState(
		false,
	);
	const [isShownProfileContent, setIsShownProfileContent] = useState(false);

	const email = useSelector(store => store.AuthData.email);
	const emailName = email && email.substring(0, email.indexOf('@'));

	const showNavContentHandler = () => {
		setIsShownNavContent(prevState => !prevState);
	};

	const showCategoriesContentHandler = e => {
		e.preventDefault();
		setIsShownCategoriesContent(prevState => !prevState);
	};

	const showProfileContentHandler = e => {
		e.preventDefault();
		setIsShownProfileContent(prevState => !prevState);
	};

	const NavLinks = (
		<>
			{' '}
			<NavLink to="/home-page" className={activeLink}>
				{' '}
				Home Page{' '}
			</NavLink>
			<NavLink to="/auctions" className={activeLink}>
				{' '}
				Auctions{' '}
			</NavLink>
			<NavLink to="/contact-us" className={activeLink}>
				{' '}
				Contact Us{' '}
			</NavLink>
		</>
	);

	const showCategories = (
		<div
			className={`text-start pb-0 fw-bold ${classes.navLink} `}
			onClick={showCategoriesContentHandler}
		>
			Categories
			{!isShownCategoriesContent && (
				<FontAwesomeIcon icon={faArrowDown} className="px-2" />
			)}
			{isShownCategoriesContent && (
				<FontAwesomeIcon icon={faArrowUp} className="px-2" />
			)}
			{isShownCategoriesContent && <Categories />}
		</div>
	);

	const isNotLoggedIn = !isLoggedIn && (
		<>
			<NavLink
				to="/register"
				className={`fw-bold ${classes.navLink} ${classes.navLinkRegister} `}
			>
				Register
			</NavLink>
			<NavLink
				to="/login"
				className={`fw-bold text-light ${classes.navLink} ${classes.navLinkLogin} `}
			>
				Login
			</NavLink>
		</>
	);

	const isLoggedInUser = isLoggedIn && (
		<div
			className={`text-start pb-0 pe-3 fw-bold ${classes.navLink} `}
			onClick={showProfileContentHandler}
		>
			<FontAwesomeIcon icon={faUser} className="px-1" /> {emailName}
			{isShownProfileContent && <DropDownBox />}
		</div>
	);

	return (
		<nav className={`${classes.nav} navbar navbar-dark fixed-top px-1  `}>
			<div className="container-fluid">
				<Row className="w-100 m-0 p-0">
					<Col lg={6} xs={8} md={4} className={`p-1`}>
						<FontAwesomeIcon
							icon={faBars}
							className={` ${classes.faBars} text-light d-inline-block d-xs d-lg-none pt-1 px-2  `}
							onClick={showNavContentHandler}
						/>
						<Link
							className={` ${classes.navbarBrand} navbar-brand fw-bold pt-3`}
							to="/home-page"
						>
							<span> Online </span> Auction
						</Link>
					</Col>

					{/* <Col lg={4} md={8} xs={12}>
						<Search />
					</Col> */}

					<Col className={classes.HeaderLinks} lg={6} md={12}>
						<div
							className={`${
								classes.navLinks
							} d-md-flex pt-1 position-relative ${
								isShownNavContent ? 'd-flex' : 'd-md-none'
							} `}
						>
							{NavLinks}
							{showCategories}
							{isNotLoggedIn}
							{isLoggedInUser}
						</div>
					</Col>
				</Row>
			</div>
		</nav>
	);
};
export default Navbar;
