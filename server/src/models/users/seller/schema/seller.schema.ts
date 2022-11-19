import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../shared-user/schema/user.schema';

export type SellerDocument = Seller & Document;

/**
 * This schema contains only properties that is specific to the Seller,
 *  as the rest of properties will be inherited from the shared-user
 */

@Schema()
export class Seller extends User {
	//* Seller rating out of 5
	@Prop({ default: 3, min: 1, max: 5 })
	rating: number;

	//* To keep track of stripe customer id to enable wallet
	@Prop({ required: true, unique: true })
	stripeCustomerId: string;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);

/* ------------------------ */
//? Setting up a virtual property for auctions
//* ==> It's not actual data stored in database.
//* ==> It's a relationship between entities.
SellerSchema.virtual('auctions', {
	ref: 'Auction',
	localField: '_id',
	foreignField: 'seller',
});
