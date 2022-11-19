import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// !for toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ! end toast
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import AdminDashboard from '../home/adminDashboard';
import Input from '../../../UI/Input/input';
import classes from './addEmployee.module.css';
import PageHeader from '../../../UI/Page Header/pageHeader';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner'

export default function AddEmployee() {
	const nameRef = useRef();
	const passwordRef = useRef();
	const emailRef = useRef();
	let successMessage, failedMessage;
	const idToken = useSelector(store => store.AuthData.idToken);
	const [loading , setLoading] = useState(false)

	const validateEmail = value => value.trim().includes('@');
	const validatePassword = value => value.trim().length > 4;
	const validateName = value => value !== '';
	const url = 'http://localhost:8000';

	const submitHandler = e => {
		e.preventDefault();
		setLoading(true)
		const employeeData = {
			name: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};

		fetch(`${url}/admin/employee/`, {
			method: 'POST',
			body: JSON.stringify(employeeData),
			headers: {
				Authorization: `Bearer ${idToken}`,
				'content-type': 'application/json',
			},
		}).then(response => {
			if (!response.ok) {
				setLoading(false)
				toast.error('Employee with that name already exists ❌');

				return;
			}
			setLoading(false)
			nameRef.current.value = '';
			emailRef.current.value = '';
			passwordRef.current.value = '';
			toast.success('Done, new Employee added successfully 💖🐱‍👤');
		});
	};
	const messageClasses = successMessage ? 'text-success' : 'text-danger';

	return (
		<AdminDashboard>
			<PageContent>
				{/*! to show toast */}
				<ToastContainer theme="dark" />
				{loading && <LoadingSpinner />}
				<PageHeader text="Add employee" showLink={false} />
				<h3 className={`text-center ${messageClasses} mt-4 fw-bold`}>
					{successMessage ? successMessage : failedMessage}
				</h3>
				<div className={`${classes.container}`}>
					<form onSubmit={submitHandler}>
						<div className="row">
							<div className="col-lg-6">
								<label for="name" className="text-light">
									{' '}
									Name{' '}
								</label>
								<Input
									type="name"
									placeholder="Type employee name..."
									validateText={validateName}
									ref={nameRef}
									errorMassage="Please enter employee name"
									inputValue=""
									id="name"
								/>
							</div>
							<div className="col-lg-6">
								<label for="password" className="text-light">
									{' '}
									Password
								</label>
								<Input
									type="password"
									placeholder="Type employee new password..."
									validateText={validatePassword}
									ref={passwordRef}
									id="password"
									errorMassage="Please enter employee new password..."
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-6">
								<label for="email" className="text-light">
									{' '}
									E-mail{' '}
								</label>
								<Input
									type="E-mail"
									placeholder="Type employee email..."
									validateText={validateEmail}
									ref={emailRef}
									errorMassage="Please enter employee email"
									inputValue=""
									id="email"
								/>
							</div>
						</div>
						<button className={`btn bg-danger text-light ${classes.btnSave}`}>
							Save Information
						</button>
					</form>
				</div>
			</PageContent>
		</AdminDashboard>
	);
}
