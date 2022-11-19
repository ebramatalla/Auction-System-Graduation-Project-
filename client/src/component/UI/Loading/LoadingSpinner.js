import React from 'react';

import classes from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
	return (
		<>
			<div className={classes.LoadingContainer}>
				<div className={classes.spinner}></div>
			</div>
		</>
	);
};

export default LoadingSpinner;
