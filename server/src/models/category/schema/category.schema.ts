import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
	@Prop({ required: true, trim: true, uppercase: true, unique: true })
	name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

/* ------------------------ */
//? Setting up a virtual property for auctions
//* ==> It's not actual data stored in database.
//* ==> It's a relationship between entities.
CategorySchema.virtual('auctions', {
	ref: 'Auction',
	localField: '_id',
	foreignField: 'category',
});
