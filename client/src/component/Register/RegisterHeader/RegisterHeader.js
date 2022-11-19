import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import classes from './RegisterHeader.module.css';

const RegisterHeader = () => {
	const steps = [
		'Personal Information',
		'Account Setup',
		'Verification',
	];

	const stepActive = useSelector(store => store.RegisterSteps);
	//let index = 0

	const HeaderContent = steps.map((item, index) => {
		return (
			<div className="col pl-0 px-0 text-light" key={index}>
				<span
					className={` ${
						stepActive[`step${index + 1}`] ? classes['active-bg'] : ''
					}  ${classes['circle-icon']}`}
				>
					{index + 1}
				</span>
				<br />
				<span
					className={` ${
						stepActive[`step${index + 1}`] ? classes['active'] : ''
					} `}
				>
					{' '}
					{item}{' '}
				</span>
			</div>
		);
	});

	return (
		<Fragment>
			<div className={classes['register-steps-header']}>
				<div className="row m-0">{HeaderContent}</div>
			</div>
		</Fragment>
	);
};

export default RegisterHeader;
