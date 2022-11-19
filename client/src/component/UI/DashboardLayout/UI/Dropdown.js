import React from 'react';
import classes from './dropdown.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Dropdown = props => {
	return (
		<div className={classes.dropdown}>
			<div
				className={`${classes.icon} ${
					classes[props.className ? props.className : '']
				}`}
			>
				{props.icon && <FontAwesomeIcon icon={props.icon} />}
			</div>

			<a
				className={`fw-bolder ${classes.username}`}
				href={`#${props.id}`}
				data-bs-toggle="collapse"
				aria-expanded="true"
			>
				<span className={classes.name}>{props.username}</span>
				<span className={classes.dropIcon}>
					<FontAwesomeIcon icon={faCaretDown} />
				</span>
			</a>

			{/* <!-- Collapsible Element HTML --> */}
			{props.list.map((item, index) => {
				return (
					<div
						className="collapse"
						id={props.id}
						key={index}
						style={{ transition: 'all 0.8s' }}
					>
						<div className={classes.linkIcon}>
							{item.icon && <FontAwesomeIcon icon={item.icon} />}
						</div>
						<Link
							to={item.path ? item.path : '/'}
							className={`card card-body fw-bold ${classes.listLink}`}
						>
							{item.title}
						</Link>
					</div>
				);
			})}
		</div>
	);
};

export default Dropdown;
