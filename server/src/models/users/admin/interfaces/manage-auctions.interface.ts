import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { ResponseResult } from 'src/common/types';
import {
	FilterAuctionQueryDto,
	RejectAuctionDto,
} from 'src/models/auction/dto';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { AdminFilterAuctionQueryDto } from '../dto';
import { RejectExtendTimeDto } from 'src/models/auction/dto/reject-extend-time-auction.dto';

export interface AdminAuctionsBehavior {
	//* List all auctions for the admin
	listAllAuctions(
		filterAuctionQuery: AdminFilterAuctionQueryDto,
	): Promise<Auction[]>;

	//* Approve specific auction
	approveAuction(id: MongoObjectIdDto): Promise<ResponseResult>;

	//* Reject specific auction
	rejectAuction(
		id: MongoObjectIdDto,
		rejectAuctionDto: RejectAuctionDto,
	): Promise<ResponseResult>;

	listAllTimeExtensionRequests();

	approveExtendAuction({
		id: auctionId,
	}: MongoObjectIdDto): Promise<ResponseResult>;

	rejectExtendAuction(
		{ id: auctionId }: MongoObjectIdDto,
		rejectExtendAuctionDto: RejectExtendTimeDto,
	): Promise<ResponseResult>;
}
