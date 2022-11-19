import React from 'react';
import './filter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export const FilterComponent = props => {
	return (
		<>
			{' '}
			<input
				className="filter"
				value={props.filterText || ''}
				onChange={props.onFilter}
				placeholder="Filter Table data ..."
			/>
			<button className="btn btn mx-2 clear" onClick={props.onClear}>
				<FontAwesomeIcon icon={faXmark} />
			</button>
		</>
	);
};
