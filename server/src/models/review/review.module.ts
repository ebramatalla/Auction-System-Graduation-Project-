import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyerModule } from '../users/buyer/buyer.module';
import { SellerModule } from '../users/seller/seller.module';
import { ReviewService } from './review.service';
import { Review, ReviewSchema } from './schema/review.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
		forwardRef(() => SellerModule),
		forwardRef(() => BuyerModule),
	],
	providers: [ReviewService],
	exports: [ReviewService],
})
export class ReviewModule {}
