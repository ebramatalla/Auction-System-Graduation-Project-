import { GetTopAuctionsDto } from '../dto';
import { AdminDashboardData } from '../types/dashboard-data.type';

export interface AdminDashboardBehavior {
	//* List dashboard needed data
	listDashboardData(): Promise<AdminDashboardData>;

	//* List all winner bidders
	listAllWinnersBidders(): Promise<any>;

	//* List all auctions with highest num of bids
	getTopAuctions(top: GetTopAuctionsDto): Promise<any>;
}
