import React from 'react';

import { useDispatch } from 'react-redux';
import { RegisterActions } from '../../../../store/slices/RegisterSlices/Register';

import classes from './Buttons.module.css';

const Buttons = props => {
	const dispatch = useDispatch();

	const previousHandler = () => {
		if (props.prev === 'Step1') {
			dispatch(RegisterActions.showStep1());
		}
	};

	const nextHandler = () => {
		if (props.nxt === 'Step2') {
			dispatch(RegisterActions.showStep2());
		}
		if(props.nxt ==='Submit'){
			props.onClick && props.onClick();

		}
	};

	return (
		<div className={classes['btn-steps']}>
			{props.prev && (
			<button
				onClick={previousHandler}
				className={`btn text-light ${classes.btnStep}`}

				type="button"
			>
				{' '}
				Previous
			</button>)}
			{props.nxt && (
				<button
					onClick={nextHandler}
					className={`btn mx-2 ${classes.btnSubmit} ${props.prev && classes.btnStep} text-light `}
					type="button"
				>
					{props.nxt ==='Submit' ? props.nxt : 'Next' }
				</button>
			)}
		</div>
	);
};

export default Buttons;
