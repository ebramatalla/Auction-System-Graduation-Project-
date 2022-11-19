import { ResponseResult } from 'src/common/types';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import {
	CreateAuctionDto,
	ExtendAuctionTimeDto,
	FilterAuctionQueryDto,
	UpdateAuctionDto,
} from '../dto';
import { AuctionStatus } from '../enums';
import { Auction, AuctionDocument } from '../schema/auction.schema';

export interface MainAuctionsBehaviors {
	//* Create new auction
	create(createAuctionDto: CreateAuctionDto, seller: Seller): Promise<Auction>;

	//* Find all auctions with filter
	findAll(filterAuctionQuery?: FilterAuctionQueryDto): Promise<Auction[]>;

	//* Get single auction
	findById(_id: string): Promise<Auction>;

	//* Get all auction of specific status
	getAuctionByStatus(status: AuctionStatus): Promise<AuctionDocument[]>;

	//* Get all auction in one category
	getAuctionByCategory(categoryId: string): Promise<AuctionDocument[]>;

	//* Get count of auctions in specific category
	getCategoryAuctionsCount(categoryId: string): Promise<number>;

	//* Update auction
	update(
		auctionId: string,
		sellerId: string,
		{ item: itemNewData, ...updateAuctionDto }: UpdateAuctionDto,
	): Promise<Auction>;

	//* Remove auction by id and seller id
	remove(auctionId: string, sellerId: string): Promise<Auction>;

	//* Check if there are running(ongoing/upcoming) auctions in one category
	isThereAnyRunningAuctionRelatedToCategory(
		categoryId: string,
	): Promise<boolean>;

	//* Remove all category in one category
	removeAllCategoryAuctions(categoryId: string): Promise<ResponseResult>;

	//* Check if auction exists or not
	isExists(auctionId: string, sellerId: string): Promise<boolean>;

	//* Extend auction duration by specific time
	requestExtendAuctionTime(
		auctionId: string,
		sellerId: string,
		extendAuctionTimeDto: ExtendAuctionTimeDto,
	);

	getAuctionsTimeExtensionRequests();

	getAuctionsTimeExtensionRequests(auctionId: string);
}
