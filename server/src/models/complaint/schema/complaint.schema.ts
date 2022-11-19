import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { User } from 'src/models/users/shared-user/schema/user.schema';

export type ComplaintDocument = Complaint & Document;

@Schema({ timestamps: true })
export class Complaint {
	@Prop({
		type: Types.ObjectId,
		ref: User.name,
		required: true,
	})
	from: Seller | Buyer | string;

	@Prop({
		type: Types.ObjectId,
		ref: User.name,
		required: true,
	})
	in: Seller | Buyer | string;

	@Prop({ required: true, minlength: 5, maxlength: 100 })
	reason: string;

	@Prop({ default: false })
	markedAsRead: boolean; // To check whether admin read the complaints or not

	@Prop({ default: false })
	inSystem: boolean; // To check whether complaint is in system or not
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
