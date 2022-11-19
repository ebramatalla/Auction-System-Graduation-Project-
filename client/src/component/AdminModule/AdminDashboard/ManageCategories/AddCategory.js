import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../../../UI/Loading/LoadingSpinner';
import classes from './add.module.css';

// start component

const AddCategory = props => {
	const [showAddCategoryForm, setShowAddCategory] = useState(false);
	const [loading , setLoading] = useState(false)
	const idToken = useSelector(store => store.AuthData.idToken);
	const url = 'http://localhost:8000';
	const nameRef = useRef();
	const toggleHandler = () => {
		setShowAddCategory(!showAddCategoryForm);
	};

	const submitHandler = e => {
		e.preventDefault();
		setLoading(true)
		let count = Math.random();
		fetch(`${url}/admin/category/`, {
			method: 'POST',
			body: JSON.stringify({ name: nameRef.current.value }),
			headers: {
				Authorization: `Bearer ${idToken}`,
				'content-type': 'application/json',
			},
		}).then(response => {
			if (!response.ok) {
				setLoading(false)
				toast.error('Category with that name already exists ❌');
				setShowAddCategory(false);
				return;
			}
			nameRef.current.value = '';
			setLoading(false)
			setShowAddCategory(false);
			props.onReload(count);
			toast.success('Done, new category added successfully 💖🐱‍👤');
		});
	};

	return (
		<>
			<div className={`${classes.container1}`}>
			{loading && <LoadingSpinner /> }
				<button
					className="btn bg-danger text-center text-light mb-4 mt-4 w-100 fw-bolder"
					onClick={toggleHandler}
				>
					Add Category
				</button>
				<ToastContainer theme="dark" />
				{showAddCategoryForm && (
					<div className={`${classes.container2}`}>
						<form onSubmit={submitHandler}>
							<label
								htmlFor="add"
								className={`form-label ${classes.formLabel} fw-bolder`}
							>
								Category Name
							</label>
							<input
								type="text"
								id="add"
								placeholder="Type unique category name here ..."
								ref={nameRef}
								className={`form-control ${classes.addInput}`}
							/>
							<button
								className={`btn bg-danger text-light text-center mb-4 mt-4  ${classes.submit}`}
							>
								Submit
							</button>
						</form>
					</div>
				)}
			</div>
		</>
	);
};
export default AddCategory;
