import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import classes from './dashboard.module.css';
import Sidebar from './sidebar/sidebar';
import Header from './Header/header';

// icons
import {
	faIdBadge,
	faUsers,
	faGavel,
	faTh,
	faListAlt,
	faComment,
	faCreditCardAlt,
} from '@fortawesome/free-solid-svg-icons';
import { getProfileData } from '../../../Api/Admin';
import useHttp from './../../../CustomHooks/useHttp';
import { useEffect } from 'react';

const Wrapper = props => {
	const {data , status , sendRequest}= useHttp(getProfileData)
	const idToken = useSelector(store => store.AuthData.idToken);
	const [userData , setUserData] = useState()

	useEffect(()=>{
		sendRequest(idToken)
	},[sendRequest])
	useEffect(() => {
		if(status === 'completed'){
			setUserData(data && data)
		}
	},[sendRequest , status])
	const role = useSelector(store => store.AuthData.role);
	const sidebarBuyer = role === 'buyer' && {
		buyer: {
			name: props.buyer.name,
			path: '/buyer-dashboard',
		},
		profile: {
			list: props.profile.list,
			name: props.profile.name,
			icon: faIdBadge,
		},
		viewAuctions: {
			list: props.viewAuctions.list,
			name: props.viewAuctions.name,
		},
		chat: { list: props.chat.list, name: props.chat.name, icon: faComment },
		payment: {
			list: props.payment.list,
			name: props.payment.name,
			icon: faCreditCardAlt,
		},
	};
	const sidebarEmployee = role === 'employee' && {
		admin: { name: props.admin.name, path: '/employeeDashboard' },
		profile: {
			list: props.profile.list,
			name: props.profile.name,
			icon: faIdBadge,
		},
		users: {
			list: props.users.list,
			name: props.users.name,
			icon: faUsers,
			class: 'users',
		},
		auctions: {
			list: props.auctions.list,
			name: props.auctions.name,
			icon: faGavel,
			class: 'auctions',
		},
		requests: {
			list: props.requestsForEmployee.list,
			name: props.requestsForEmployee.name,
			icon: faTh,
			class: 'requests',
		},
		compliments: {
			list: props.compliments.list,
			name: props.compliments.name,
			icon: faComment,
			class: 'auctions',
		},
		Inquiries: {
			list: props.inquiries.list,
			name: props.inquiries.name,
			icon: faComment,
			class: 'requests',
		},
	};
	const sidebarAdmin = role === 'admin' && {
		admin: { name: props.admin.name, path: '/adminDashboard' },
		profile: {
			list: props.profile.list,
			name: props.profile.name,
			icon: faIdBadge,
			class:'requests'
		},
		employees: {
			list: props.Employees.list,
			name: props.Employees.name,
			icon: faUsers,
			class: 'users',
		},
		users: {
			list: props.users.list,
			name: props.users.name,
			icon: faUsers,
			class: 'users',
		},
		auctions: {
			list: props.auctions.list,
			name: props.auctions.name,
			icon: faGavel,
			class: 'auctions',
		},
		requests: {
			list: props.requests.list,
			name: props.requests.name,
			icon: faTh,
			class: 'requests',
		},
		categories: {
			list: props.categories.list,
			name: props.categories.name,
			icon: faListAlt,
			class: 'categories',
		},
		compliments: {
			list: props.complaintsInSystem.list,
			name: props.complaintsInSystem.name,
			icon: faComment,
			class: 'requests',
		},
	};

	const sidebarSeller = role === 'seller' && {
		seller: { name: props.seller.name, path: '/seller-dashboard' },
		profile: {
			list: props.profile.list,
			name: props.profile.name,
			icon: faIdBadge,
		},
		viewAuctions: {
			list: props.viewAuctions.list,
			name: props.viewAuctions.name,
		},
		SellerChat: {
			list: props.SellerChat && props.SellerChat.list,
			name: props.SellerChat && props.SellerChat.name,
			icon: faComment,
		},
	};

	const sidebarContent = {
		admin: sidebarAdmin,
		employee: sidebarEmployee,
		seller: sidebarSeller,
		buyer: sidebarBuyer,
	};

	const [showSideBar, setShowSideBar] = useState(true);

	const toggleSidebar = () => {
		setShowSideBar(!showSideBar);
	};
	return (
		<div className={`container-fluid  ${classes.wrapper}  `}>
			<div className="row  position-relative">
				{showSideBar && (
					<div
						className={` ${
							showSideBar ? classes.showSideBarSmallMedia : ''
						} col-lg-3 col-md-3 p-0 m-0  `}
					>
						<Sidebar
							sidebarContent={sidebarContent[role]}
							role={role}
							userData={userData && userData}
						/>
					</div>
				)}

				<div className={`  col-lg col-md p-0 m-0`}>
					<Header
						toggleSidebar={toggleSidebar}
						showSideBarValue={showSideBar}
						userData={userData && userData}
					/>
					{props.children}
				</div>
			</div>
		</div>
	);
};
export default Wrapper;
