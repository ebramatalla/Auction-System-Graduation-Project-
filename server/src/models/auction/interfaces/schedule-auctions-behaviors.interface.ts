import { AuctionStatus } from '../enums';

export interface ScheduleAuctionsBehaviors {
	//* When start date came, set the status to ongoing
	markAuctionAsStarted(auctionId: string): Promise<boolean>;

	//* When start date came, set the status to closed
	markAuctionAsEnded(auctionId: string): Promise<boolean>;

	//* Search for auction and update its status to given one
	updateAuctionStatus(
		auctionId: string,
		status: AuctionStatus,
	): Promise<boolean>;

	//* Get the end date of an auction
	getAuctionEndDate(auctionId: string): Promise<any>;
}
