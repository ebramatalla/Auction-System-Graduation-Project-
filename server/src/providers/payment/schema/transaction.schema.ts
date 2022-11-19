import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { User } from 'src/models/users/shared-user/schema/user.schema';
import { TransactionType } from '../enums';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
	@Prop({ required: true })
	amount: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: User.name,
		autopopulate: true,
	})
	sender: User | null;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: User.name,
		autopopulate: true,
	})
	recipient: User | null;

	@Prop({ enum: Object.values(TransactionType), required: true })
	transactionType: TransactionType;

	//* This field only true if the transaction is related to auction assurance
	@Prop({ default: false })
	isBlockAssuranceTransaction: boolean;

	@Prop()
	paymentIntentId: string | null;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
