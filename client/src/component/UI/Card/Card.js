import React, { Fragment } from 'react';
import classes from './Card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Card = props => {
	return (
		<Fragment>
			<div
				className={`${
					props.className ? classes[props.className] : ''
				} container ${classes['register-steps-content']} `}
			>
				<div className={classes['user-icon']}>
					<span className={classes['circle-icon']}>
						<FontAwesomeIcon icon={faUser} />
					</span>
				</div>

				{props.children}
			</div>
		</Fragment>
	);
};

export default Card;
