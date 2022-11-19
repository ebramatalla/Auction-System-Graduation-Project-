import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';
import classes from './pageHeader.module.css';

function PageHeader({ text, showLink , filterText= ''}) {
	return (
		<div className={`${classes.AuctionHeader} mb-4 `}>
			<h2
				className={` ${
					showLink ? 'd-inline-block' : 'd-block w-100 text-center'
				} text-light fw-bold pt-4 pb-0 px-5  `}
			>
				{' '}
				{text}{' '}
			</h2>
			{showLink && (
				<Link
					className={` text-light text-decoration-none px-5 ${classes.btnGetAuctions}`}
					to={filterText ? `/auctions?status=${filterText}` : '/auctions'}
				>
					<h5 className="text-danger fw-bold p-3 pb-0 d-inline-block">
						{' '}
						See All Auctions{' '}
					</h5>
					<FontAwesomeIcon icon={faCircleArrowRight} className="text-danger"/>
				</Link>
			)}
		</div>
	);
}

export default PageHeader;
