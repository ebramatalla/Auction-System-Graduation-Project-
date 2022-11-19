import React from 'react';
import { Link } from 'react-router-dom';
import classes from './login.module.css';
import LoginForm from './LoginForm';

const Login = () => {
	return (
		<div className={classes.login}>
			<div className="container-fluid m-0 p-0">
				<div className="row m-0 p-0">
					<div className="col-lg-8 col-xs-12 h-100 px-0 pl-0 position-relative">
						<div
							className={`w-100 h-100 ${classes.overlay} position-absolute`}
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

						<div className={`${classes.img}`}></div>
					</div>

					<div className="col-lg-4  col-xs-12 px-0 pl-0 ">
						<div className={classes.form}>
							<h1 className="pt-3"> Login </h1>
							<h3> Let's start with login</h3>
							<LoginForm />
							<p className="text-center text-light ">
								Don't have an account ?{' '}
								<Link to="/register" className=" text-decoration-none">
									Register Now
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
