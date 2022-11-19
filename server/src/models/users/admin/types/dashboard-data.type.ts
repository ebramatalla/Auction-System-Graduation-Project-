export type AdminDashboardData = {
	//* Auctions data
	auctions: {
		total: number;
		pending: number;
		ongoing: number;
		upcoming: number;
		closed: number;
		denied: number;
	};

	/*---------------------*/
	//* Categories data
	categories: {
		total: number;
	};

	/*---------------------*/
	//* Users data
	users: {
		total: number;
		admins: number;
		employees: number;
		sellers: number;
		buyers: number;
	};

	/*---------------------*/
	//* Complaints
	complaints: {
		total: number;
		notReadYet: number;
	};
};
