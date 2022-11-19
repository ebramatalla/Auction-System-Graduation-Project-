import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { ResponseResult } from 'src/common/types';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { ListBidderAuctionsQueryDto } from '../dto';
import { Buyer, BuyerDocument } from '../schema/buyer.schema';

export interface BuyerAuctionsBehaviors {
	//* List all joined auctions
	listBidderAuctions(
		listBidderAuctionsQueryDto: ListBidderAuctionsQueryDto,
		buyer: BuyerDocument,
	): Promise<any>;

	//* Try to join auction
	joinAuction(buyer: Buyer, auctionId: MongoObjectIdDto);

	//* List all buyer auctions
	listMyAuctions(buyer: string): Promise<Auction[]>;

	//* Retreat from auction
	retreatFromAuction(buyer: Buyer, auctionId: MongoObjectIdDto);

	//* Mark the auction as interesting to receive email when starting
	saveAuctionForLater(
		buyer: Buyer,
		auctionId: MongoObjectIdDto,
	): Promise<ResponseResult>;

	//* Mark the auction as interesting to receive email when starting
	isSavedAuction(
		buyer: Buyer,
		auctionId: MongoObjectIdDto,
	): Promise<ResponseResult>;
}
