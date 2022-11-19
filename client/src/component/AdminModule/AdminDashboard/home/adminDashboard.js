import React from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../../UI/DashboardLayout/DashboardLayout';
import { faComment, faGavel } from '@fortawesome/free-solid-svg-icons';
import { faTh } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import DashboardContent from '../dashboard_content/dashboard';

const AdminDashboard = props => {
	const dropdownListProfile = [
		{
			title: 'Edit Account',
			icon: faGavel,
			path: '/employeeDashboard/UpdateAccount',
		},
	];
	const dropdownListForComplaints = [
		{
			title: 'All complaints',
			icon: faComment,
			path: '/managersDashboard/allComplaints',
		},
	];
	const dropdownListForComplaintsInSystem = [
		{
			title: 'All complaints',
			icon: faComment,
			path: '/adminDashboard/allComplaintsInSystem',
		},
	];
	const dropdownListForInquiries = [
		{
			title: 'Inquiries ',
			icon: faComment,
			path: '/employeeDashBoard/chat',
		},
	];
	const dropdownListForEmployees = [
		{
			title: 'ListAllEmployees',
			icon: faUser,
			path: '/managersDashboard/listAllEmployees',
		},
		{
			title: 'AddEmployee',
			icon: faUser,
			path: '/managersDashboard/addEmployee',
		},
	];
	const dropdownListManageAuctions = [
		{
			title: 'All Auctions',
			icon: faGavel,
			path: '/managersDashboard/allAuctions',
		},
		{
			title: 'Current Auctions',
			icon: faGavel,
			path: '/managersDashboard/currentAuctions',
		},

		{
			title: 'Upcoming Auctions',
			icon: faGavel,
			path: '/managersDashboard/upcomingAuctions',
		},
	];

	const dropdownListManageUsers = [
		{ title: 'Sellers', icon: faUser, path: '/managersDashboard/sellersPage' },
		{ title: 'Buyers', icon: faUser, path: '/managersDashboard/buyersPage' },
	];
	const dropdownListAuctionsRequests = [
		{
			title: 'Pending auctions',
			icon: faTh,
			path: '/managersDashboard/pendingAuctions',
		},
	];
	const dropdownListRequests = [
		{
			title: 'Pending auctions',
			icon: faTh,
			path: '/managersDashboard/pendingAuctions',
		},
		{
			title: 'Extensions requests',
			icon: faTh,
			path: '/employeeDashboard/extendRequests',
		},
	];
	const dropdownListManageCategories = [
		{
			title: 'Manage Categories',
			icon: faTh,
			path: '/managersDashboard/manageCategories',
		},
	];
	const email = useSelector(store => store.AuthData.email);
	const contentExist = props.children;

	return (
		<DashboardLayout
			profile={{ name: 'Manage Profile', list: dropdownListProfile }}
			admin={{ name: email ? email : 'user' }}
			Employees={{ name: 'Manage Employees  ', list: dropdownListForEmployees }}
			users={{ name: 'Manage Users  ', list: dropdownListManageUsers }}
			auctions={{ name: 'Manage Auctions', list: dropdownListManageAuctions }}
			requests={{
				name: 'Manage Requests   ',
				list: dropdownListAuctionsRequests,
			}}
			requestsForEmployee={{
				name: 'Manage Requests   ',
				list: dropdownListRequests,
			}}
			categories={{
				name: 'Manage Categories',
				list: dropdownListManageCategories,
			}}
			compliments={{
				name: 'Manage complaints',
				list: dropdownListForComplaints,
			}}
			complaintsInSystem={{
				name: 'Manage Complaints in System',
				list: dropdownListForComplaintsInSystem,
			}}
			inquiries={{
				name: 'Inquiries',
				list: dropdownListForInquiries,
			}}
		>
			{contentExist ? props.children : <DashboardContent />}
		</DashboardLayout>
	);
};

export default AdminDashboard;
