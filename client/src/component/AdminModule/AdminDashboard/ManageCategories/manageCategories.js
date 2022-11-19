import React from 'react';
import AdminDashboard from '../home/adminDashboard';
import PageContent from '../../../UI/DashboardLayout/Pagecontant/pageContent';
import AddCategory from './AddCategory';
import AllCategories from './allCategory';
import PageHeader from '../../../UI/Page Header/pageHeader';

const ManageCategories = () => {
	const [showNewCategoryList, setShowNewCategoryList] = React.useState('');

	const ReloadTableHandler = value => {
		setShowNewCategoryList(value);
	};
	return (
		<AdminDashboard>
			<PageContent>
				<PageHeader text="Manage Categories" showLink={false} />

				<AddCategory onReload={ReloadTableHandler} />
				<AllCategories
					reload={showNewCategoryList}
					// onReload={setReloadWhenRemoveCategory}
				/>
			</PageContent>
		</AdminDashboard>
	);
};
export default ManageCategories;
