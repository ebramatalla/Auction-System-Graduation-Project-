import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ErroImage from '../../assets/pexels-miguel-á-padriñán-2882552.jpg';
import classes from './NotFound.module.css';

function NotFound() {
	return (
		<Row className="m-0 p-0">
			<Col lg={6} className={`p-0 ${classes.Col}`}>
				<img src={ErroImage} alt="ErrorImage" className="w-100 h-100 " />
			</Col>
			<Col lg={6} className="m-auto">
				<h1 className={classes.OOPs}> OOPS </h1>
				<h1 className={classes.PageNotFoundHeading}>Page Not Found </h1>
				<Link
					to="/"
					className={` text-light text-center text-decoration-none ${classes.BackHomeLink}`}
				>
					<h4> Back To HomePage </h4>
				</Link>
			</Col>
		</Row>
	);
}

export default NotFound;
