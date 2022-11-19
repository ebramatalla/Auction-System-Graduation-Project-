import React, { useEffect, useRef, useState } from 'react';
import {useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ChangePasswordForUsers } from '../../../Api/usersApi';
import useHttp from '../../../CustomHooks/useHttp';
import Input from '../Input/input';
import LoadingSpinner from '../Loading/LoadingSpinner';

import ModalUi from '../Modal/modal';

function ChangePassword({show, onHide }) {

	const [reload , setReload] = useState('')
	const [loading, setLoading] = useState(false);

	const idToken = useSelector(store=>store.AuthData.idToken)
	const role = useSelector(store=>store.AuthData.role)


	const {
		sendRequest: sendRequestForChangeToNewPassword,
		status: statusForChangeToNewPassword,
		data: dataForChangeToNewPassword,
		error: errorForChangeToNewPassword,
	} = useHttp(ChangePasswordForUsers);

	const validatePassword = value => value.trim().length > 4;

	const [ModalTitle, setModalTitle] = useState('Do you Want Change Your Password?');
	const [ModalBtn, setModalBtn] = useState('Yes');
	const [ModalBody, setModalBody] = useState('');


	// start change password Api
	useEffect(() => {
		if (statusForChangeToNewPassword === 'completed') {
			setLoading(false);
			toast.success(dataForChangeToNewPassword.message);

			setModalTitle(
				'Your password has been changed successfully, login now 💙✔',
			);
			setModalBody('');
			setModalBtn('');

		}

		if (statusForChangeToNewPassword === 'error') {
			setLoading(false);
			toast.error(errorForChangeToNewPassword);
		}
	}, [statusForChangeToNewPassword , reload]);


	// change Password Refs
	const newPasswordRef = useRef();
	const oldPasswordRef = useRef();


	// start Modal Body
	const PasswordsInput = (
		<div>
			<h3 className="text-light fw-bold text-center pb-4">
				Please Enter New and Old Password
			</h3>
			<Input
				type="password"
				placeholder="OldPassword"
				validateText={validatePassword}
				ref={oldPasswordRef}
				errorMassage="Please enter valid password"
				id="oldPassword"
			/>

			<Input
				type="password"
				placeholder="NewPassword"
				validateText={validatePassword}
				ref={newPasswordRef}
				errorMassage="Please enter valid password"
				id="newPassword"
			/>
		</div>
	);
	// end Modal Body




	const ChangePasswordHandler = () => {
		// confirm that you want to change password
		if (ModalBtn === 'Yes') {
			setModalTitle('');
			setModalBody(PasswordsInput);
			setModalBtn('Change Password');
		}
		if (ModalBtn === 'Change Password') {
			if (oldPasswordRef.current.value && newPasswordRef.current.value) {
				const oldPassword = oldPasswordRef.current.value;
				const newPassword = newPasswordRef.current.value;

				sendRequestForChangeToNewPassword({
					idToken ,
					role,
					oldPassword ,
					newPassword
				});
				setLoading(true);
				setReload(Math.random())
			}
		}
	};

	return (
		<React.Fragment>
			{loading && <LoadingSpinner />}
			{show && (
				<ModalUi
					show={show}
					onHide={onHide}
					title={ModalTitle}
					body={ModalBody}
					btnName={ModalBtn}
					btnHandler={ChangePasswordHandler}
					hideBorder={true}
				/>
			)}
		</React.Fragment>
	);
}

export default ChangePassword;
