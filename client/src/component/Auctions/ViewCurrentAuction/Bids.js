import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import classes from './Bids.module.css';
import scrollbarStyle from '../../UI/ScrollBar.module.css';
import moment from 'moment';

const Bids = ({roomData , messageToClient , status}) => {
	console.log(roomData && roomData)
	const showRoomData = roomData && roomData.bids  && (
		roomData.bids.map((bidDetails, index) => (
			<div
				className={`${classes.BidsContent} toast d-block mb-2 w-100`}
				role="alert"
				key={index}
			>
				<div className={`toast-header text-dark ${classes.BidsHeader}`}>
					<FontAwesomeIcon
						icon={faUser}
						className="px-1 rounded-circle bg-dark text-light p-2 mx-2 fs-6 "
					/>

					<strong className="me-auto text-light fw-bold ">
						{' '}
						{(bidDetails['user'] && bidDetails['user']['name']) ||
							bidDetails.userEmail}{' '}
					</strong>
					<small className="text-danger fw-bold ">
						{' '}
						{moment(bidDetails.createdAt).format('LTS')}
					</small>
				</div>
				<div className="toast-body text-light fw-bold fs-6 p-1 px-3 text-danger">{bidDetails.amount} </div>
			</div>
		))
	)



	return (
		<div>
			{messageToClient && (
				<div className={classes.messageToClient}> {messageToClient} </div>
			)}

			<div className={`${scrollbarStyle.scrollbar} ${classes.Bids} `}>

			{showRoomData}
		{roomData.bids && roomData.bids.length === 0 && status !=='ongoing' && <p className="text-danger text-center fw-bold fs-5 p-2"> No Bidding  </p>}

		</div>
		</div>

	);
};

export default Bids;
