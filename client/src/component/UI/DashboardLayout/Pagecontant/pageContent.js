import React from 'react';
import classes from './content.module.css';

const PageContent = props => {
	return (
		<React.Fragment>
			<div
				className={`${classes.PageContent} ${
					props.className ? props.className : ''
				}`}
			>
				{/* <h1> PageContent</h1> */}
				{props.children}
			</div>
			{/* <div className='bg-black'>
			<Footer/>
		</div> */}
		</React.Fragment>
	);
};

export default PageContent;
