import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AuthDataActions } from '../../store/slices/RegisterSlices/AuthData';
import { Login } from '../../Api/Auth';
import useHttp from '../../CustomHooks/useHttp';

import Input from '../UI/Input/input';
import Card from '../UI/Card/Card';
import classes from './loginForm.module.css';

//images
import facebookImg from '../../assets/facebook.png';
import googleImg from '../../assets/google-logo-9808.png';
import twitterImg from '../../assets/twitter.png';
import { toast, ToastContainer } from 'react-toastify';
import ForgetPassword from '../UI/ForgetPasswordModal/ForgetPassword';
import LoadingSpinner from '../UI/Loading/LoadingSpinner';

const LoginForm = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading , setLoading] = useState(false)

	const { sendRequest, status, data, error } = useHttp(Login);
	const idToken = useSelector(store => store.AuthData.idToken);
	const [load , setLoad] = useState(false)

	const nameRef = useRef();
	const passwordRef = useRef();

	const validateEmail = value => value.trim().includes('@');
	const validatePassword = value => value.trim().length > 4;

	const [ShowModal, setShowModal] = useState('');

	const submitHandler = e => {
			e.preventDefault();
			setLoading(true)
			const userDetails = {
				email: nameRef.current.value,
				password: passwordRef.current.value,
				idToken,
			};
			sendRequest(userDetails);
			setLoad(Math.random())

	};

	// start submit Login
	useEffect(() => {
		if (status === 'completed') {
			setLoading(false)
			const email = nameRef.current.value;
			dispatch(
				AuthDataActions.login({
					idToken: data.accessToken,
					role: data.role,
					email: email,
				}),
			);
			toast.success('Login Successfully ❤️‍🔥 ');
			const timer = setTimeout(() => {
				if (data.role === 'buyer') {
					navigate('/home-page');
				} else if (data.role === 'admin') {
					navigate('/adminDashboard');
				} else if (data && data.role === 'seller') {
					navigate('/seller-dashboard');
				}
				if (data && data.role === 'employee') {
					navigate('/employeeDashboard');
				}
			}, 1000);

			return () => clearTimeout(timer);
		}
		if (status === 'error' || error) {
			setLoading(false)
			console.log('error')
			toast.error(error);
		}
}, [status]);


	return (
		<div className={classes['form-container']}>
			<ToastContainer theme="dark" />
			{loading && <LoadingSpinner />}
			<Card className={'loginCard'}>
				<form onSubmit={submitHandler}>
					<Input
						type="email"
						placeholder="Email"
						validateText={validateEmail}
						ref={nameRef}
						errorMassage="please enter your email"
						id = "email"

					/>
					<Input
						type="password"
						placeholder="Password"
						validateText={validatePassword}
						ref={passwordRef}
						errorMassage="please enter valid password"
						id = "password"
					/>
					<div className={classes.text}>
						<p className="text-primary text-end float-right w-100" onClick={()=>setShowModal(true)}> Forget password ?</p>
					</div>

					<button className="btn btn-primary" onSubmit={submitHandler}>
						Login
					</button>
				</form>
				<div className={classes.accounts}>
					<img src={facebookImg} alt="facebookImg" />
					<img src={twitterImg} alt="twitterImg" />
					<img src={googleImg} alt="googleImg" />
				</div>
			</Card>


			{ShowModal && (
				<ForgetPassword forget = {true} show={ShowModal}  onHide={()=> setShowModal(false)}/>
			)}
		</div>

	);
};

export default LoginForm;
