import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { ResponseResult } from 'src/common/types';
import {
	CreateReviewDto,
	FindReviewInSeller,
	UpdateReviewDto,
} from 'src/models/review/dto';
import { Review } from 'src/models/review/schema/review.schema';
import { Buyer } from '../schema/buyer.schema';

export interface BuyerReviewsBehaviors {
	//* Submit new review
	submitReviewOnSeller(
		createReviewDto: CreateReviewDto,
		buyerId: string,
	): Promise<Review>;

	//* Get buyer review in specific seller
	getReviewOnSeller(
		{ sellerId }: FindReviewInSeller,
		buyerId: string,
	): Promise<Review>;

	//* Edit buyer review
	editReview(
		id: MongoObjectIdDto,
		updateReviewDto: UpdateReviewDto,
		buyerId: string,
	): Promise<Review>;

	//* Remove buyer review in seller
	deleteReview(id: MongoObjectIdDto, buyerId: string): Promise<ResponseResult>;
}
