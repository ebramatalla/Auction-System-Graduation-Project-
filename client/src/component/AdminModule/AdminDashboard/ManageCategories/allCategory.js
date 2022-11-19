import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// toast
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// end toast
import useHttp from '../../../../CustomHooks/useHttp';
import { getAllCategoriesForAdmin, remove } from './../../../../Api/Admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useFilter from '../../../UI/TableLayout/FilteringTable/filter';
import DataTable from 'react-data-table-component';
import ModalUi from '../../../UI/Modal/modal';

const AllCategories = props => {
	const [ModalShow, setModalShow] = useState(false);
	const [categoryId, setCategoryId] = useState('');

	const [ModalTitle, setModalTitle] = useState(
		'Are you sure to Delete this category?',
	);
	const [ModalBtn, setModalBtn] = useState('Confirm');
	const [
		reloadWhenRemoveCategory,
		setReloadWhenRemoveCategory,
	] = React.useState('');
	//! cols name
	const columns = [
		{
			name: 'Name',
			selector: row => row.name,
			sortable: true,
			center: true,
		},
		{
			name: 'Number of Auctions',
			selector: row => row.auctionsCount,
			center: true,
			sortable: true,
		},

		{
			name: 'Actions',
			selector: row => row.action,
			center: true,
			cell: props => {
				return (
					<>
						<button
							className="btn bg-danger text-light my-2 "
							onClick={() => showModel(props._id)}
						>
							<FontAwesomeIcon icon={faXmark} />
						</button>
					</>
				);
			},
		},
	];
	// handle get all categories
	const { sendRequest, data } = useHttp(getAllCategoriesForAdmin);
	const idToken = useSelector(store => store.AuthData.idToken);
	useEffect(() => {
		sendRequest(idToken);
	}, [sendRequest, props.reload, reloadWhenRemoveCategory]);
	// remove api
	const {
		sendRequest: sendRequestForRemove,
		status: statusForRemove,
		error: errorForRemove,
	} = useHttp(remove);

	// ! handle remove
	//
	const showModel = category_Id => {
		setCategoryId(category_Id);
		setModalShow(true);
	};
	const removeHandler = categoryId => {
		sendRequestForRemove({
			path: `category/${categoryId}`,
			accessToken: idToken,
		});
		setReloadWhenRemoveCategory(categoryId);
	};

	useEffect(() => {
		if (statusForRemove === 'completed') {
			toast.success('Deleted Successfully 💖🐱‍👤');
			setModalShow(false);
		} else if (statusForRemove === 'error') {
			toast.error(`${errorForRemove} 💖🐱‍👤`);
			setModalTitle(errorForRemove);
			setModalBtn('');
		}
	}, [statusForRemove, errorForRemove, reloadWhenRemoveCategory]);

	// useEffect(() => {
	// 	if (errorForRemove && statusForRemove === 'error') {
	// 		toast.error(`${errorForRemove} 💖🐱‍👤`);
	// 		setModalTitle(errorForRemove);
	// 		setModalBtn('');
	// 	}
	// }, [errorForRemove, statusForRemove]);
	// ! end remove

	//filter
	const items = data ? data : [];
	const { filterFun, filteredItems } = useFilter(items, 'name');
	//end filter
	return (
		<>
			{/* <ToastContainer theme="dark" /> */}
			{data && (
				<DataTable
					columns={columns}
					data={filteredItems}
					subHeader
					subHeaderComponent={filterFun}
					theme="dark"
					pagination
				/>
			)}

			{ModalShow && (
				<ModalUi
					show={ModalShow}
					onHide={() => setModalShow(false)}
					btnHandler={() => removeHandler(categoryId)}
					// Id={categoryId && categoryId}
					title={ModalTitle}
					btnName={ModalBtn}
				/>
			)}
		</>
	);
};
export default AllCategories;
