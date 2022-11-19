import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { User } from 'src/models/users/shared-user/schema/user.schema';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
	@Prop({
		type: Types.ObjectId,
		ref: User.name,
		required: true,
	})
	seller: Seller;

	@Prop({
		type: Types.ObjectId,
		ref: User.name,
		required: true,
	})
	buyer: Buyer;

	@Prop({ required: true, trim: true, minlength: 3, maxlength: 1000 })
	message: string;

	@Prop({ required: true, min: 0, max: 5 })
	review: number;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
