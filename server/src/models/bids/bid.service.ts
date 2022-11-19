import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model, ObjectId } from 'mongoose';
import { Socket } from 'socket.io';
import { ResponseResult } from 'src/common/types';
import { AuctionsService } from '../auction/auctions.service';

import { AuthService } from '../auth/auth.service';
import { Buyer } from '../users/buyer/schema/buyer.schema';
import { User } from '../users/shared-user/schema/user.schema';
import { BidDocument, Bid } from './schema/bid.schema';
import { NewBid } from './types/new-bid.type';

@Injectable()
export class BidService {
	private readonly logger: Logger = new Logger(BidService.name);

	constructor(
		@InjectModel(Bid.name)
		private readonly bidModel: Model<BidDocument>,
		private readonly authService: AuthService,
		private readonly auctionService: AuctionsService,
	) {}

	/**
	 * Accept the socket client and return the user
	 * @param client
	 * @return user if found
	 */
	async getConnectedClientUserObject(client: Socket): Promise<User | null> {
		//* Get the access token from client
		const accessToken = await this.authService.getJWTTokenFromSocketClient(
			client,
		);

		//? If no access token found
		if (!accessToken) {
			return null;
		}

		//* Get the user
		const user = await this.authService.getUserFromJWT(accessToken); //* The user may be null (expired token)

		return user;
	}

	/**
	 * Handle new incoming bid
	 * @param auctionId
	 * @param userId
	 * @param bidValue
	 */
	async HandleBid(
		auctionId: string,
		userId: ObjectId,
		bidValue: number,
	): Promise<NewBid> {
		this.logger.debug(
			'New bid accepted ⚡⚡ with value ' + bidValue + ' from ' + userId,
		);

		//* Check if the auction still ongoing
		const isStillOngoing: boolean =
			await this.auctionService.isValidAuctionForBidding(auctionId);

		if (!isStillOngoing) {
			this.logger.error('Auction has been ended ❌');
			throw new WsException(
				'This auction has been ended, you cannot bid anymore ❌',
			);
		}

		//* Before create the bid, check if it is valid
		const isValidBid = await this.auctionService.isValidBid(
			auctionId,
			bidValue,
		);

		if (!isValidBid) {
			this.logger.error('Bid rejected (Invalid value) 🤷‍♂️');
			throw new WsException(
				'Bid value must be match with minimum bid value 👀',
			);
		}

		//* Create new bid
		const createdBid: BidDocument = new this.bidModel({
			user: userId,
			auction: auctionId,
			amount: bidValue,
		});

		if (!createdBid) {
			this.logger.error('Bid not created 🤷‍♂️');
			throw new WsException('Failed accept this bid 😔');
		}

		//* Save the created bid
		await createdBid.save();

		//* Handle the new bid for the auction
		const result = await this.auctionService.handleNewBid(
			auctionId,
			createdBid,
		);

		if (!result) {
			this.logger.error('Bid not saved 🤷‍♂️');
			throw new WsException('Failed to handle new bid');
		}

		//* Return specific data to the client
		return {
			amount: createdBid.amount,
			auction: createdBid.auction._id.toString(),
			user: {
				name: createdBid.user.name,
				email: createdBid.user.email,
			},
			createdAt: createdBid.createdAt,
		};
	}

	/**
	 * Handle if the bid is in last minute or not
	 * @param bidDate - bid created at
	 * @param auctionId - auction id
	 */
	async handleIfBidInLastMinute(
		bidDate: Date,
		auctionId: string,
	): Promise<ResponseResult> {
		return this.auctionService.handleIfBidInLastMinute(auctionId, bidDate);
	}

	/**
	 * Retreat given bidder from given auction
	 * @param bidder
	 * @param auctionId
	 */
	async retreatBidderFromAuction(bidder: Buyer, auctionId: string) {
		const result: ResponseResult =
			await this.auctionService.retreatBidderFromAuction(bidder, auctionId);

		if (!result.success) {
			this.logger.error('Cannot retreat you right now 🤷‍♂️');
			throw new WsException(result.message);
		}

		return result;
	}

	/* Get all bids in given auction
	 * @param auctionId
	 * @returns List of all bids for the given auction
	 */
	async getAuctionBids(auctionId: string): Promise<any> {
		const bids: Bid[] = await this.bidModel.find({
			auction: auctionId,
		});

		//* Return only specific data
		const serializedBids = bids.map((bid: Bid) => {
			return {
				user: {
					_id: bid.user._id,
					name: bid.user.name,
					email: bid.user.email,
				},
				amount: bid.amount,
				createdAt: bid.createdAt,
			};
		});

		return serializedBids;
	}
}
