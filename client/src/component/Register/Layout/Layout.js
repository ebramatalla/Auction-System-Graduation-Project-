import React, { Fragment } from 'react';
import RegisterContent from '../RegisterContent/RegisterContent';
import RegisterHeader from '../RegisterHeader/RegisterHeader';

import classes from './Layout.module.css';
import scrollbarStyle from '../../UI/ScrollBar.module.css';
import { Link } from 'react-router-dom';

const Layout = props => {
	return (
		<Fragment>
			<div
				className={`${classes.Register} ${scrollbarStyle.scrollbar} text-center h-100`}
			>
				<div className="container-fluid p-0">
					<div className="row m-0 p-0 h-100">
						<div
							className={` ${classes['register-bg']} col-lg-7 col-xs-12 position-relative pl-0 px-0`}
						>
							<div
								className={` ${classes['register-bg-overlay']}  w-100 h-100 position-absolute `}
							></div>
							<div className={`${classes.logo} position-absolute `}>
								<Link
									to="/"
									className="text-light  mt-3 fw-bolder text-decoration-none "
								>
									<h2>
										On<span>Line Auction</span>
									</h2>
								</Link>
							</div>
							<div className={classes.background}> </div>
						</div>

						<div
							className={` ${classes['register-content']} col-lg-5 col-xs-12 pl-0 px-0 `}
						>
							<RegisterHeader />
							<RegisterContent />
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Layout;
