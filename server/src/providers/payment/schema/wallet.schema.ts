import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { User } from 'src/models/users/shared-user/schema/user.schema';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
	@Prop({ required: true, default: 0 })
	balance: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: User.name,
		autopopulate: true,
		required: true,
	})
	user: Seller | Buyer;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
