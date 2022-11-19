import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, ObjectId } from 'mongoose';
import { AuctionStatus } from '../enums';
import { Item } from 'src/models/items/schema/item.schema';
import { Category } from 'src/models/category/schema/category.schema';
import { User } from 'src/models/users/shared-user/schema/user.schema';
import { Transform, Type } from 'class-transformer';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Bid } from 'src/models/bids/schema/bid.schema';
import { ExtendAuctionTimeType } from '../types';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { boolean } from '@hapi/joi';

export type AuctionDocument = Auction & Document;

@Schema()
export class Auction {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop({ required: true, trim: true })
	title: string;

	@Prop({
		required: true,
		type: Types.ObjectId,
		ref: Item.name,
	})
	item: Item;

	@Prop({ required: true, min: 0 })
	basePrice: number; //? Auction starting price

	@Prop({ required: true })
	startDate: Date;

	@Prop({ default: null })
	endDate: Date;

	@Prop({ required: true, min: 0, default: null })
	chairCost: number; //? The cost of registering to bid.

	/*
  ? The minimum acceptable amount that is required for a bidder to place a Bid on an Item.
  ? The Minimum Bid is calculated using the Bidding Increment Rules and the Current Bid.
  * The Minimum Bid is equal to the Base price when the Bidding begins.
  */
	@Prop({ required: true, min: 0 })
	minimumBidAllowed: number;

	@Prop({ min: 0, default: null })
	currentBid: number; //? Current highest bid value

	@Prop({ min: 0, default: 0 })
	bidIncrement: number; //? minimum acceptable amount, calculated from Bidding Increment Rules.

	@Prop({ min: 0, default: 0 })
	numOfBids: number; //? Current number of bids

	//*Create new prop with type ExtendAuctionTimeType
	@Prop({ type: ExtendAuctionTimeType, default: null })
	extensionTime: ExtendAuctionTimeType; //? Time to extend auction duration

	@Prop({ default: false })
	isExtended: boolean; //? Is auction duration extended?

	@Prop({ enum: AuctionStatus, default: AuctionStatus.Pending })
	status: AuctionStatus;

	@Prop({ default: null })
	rejectionMessage: string;

	@Prop({
		type: Types.ObjectId,
		ref: User.name,
		default: null,
	})
	winningBuyer: Buyer;

	@Prop({
		type: Types.ObjectId,
		ref: User.name,
		autopopulate: true,
	})
	seller: Seller;

	@Prop({
		type: Types.ObjectId,
		ref: Category.name,
		autopopulate: true,
	})
	category: Category;

	@Prop({
		type: [{ type: Types.ObjectId, ref: User.name, autopopulate: true }],
	}) //* This syntax is very important as the last was not populating all array
	bidders: Buyer[];

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Bid', autopopulate: true }] })
	bids: Bid[];

	//* To keep track of all bidders that should be notified when the auction start
	@Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
	waitingBidders: Buyer[];
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
