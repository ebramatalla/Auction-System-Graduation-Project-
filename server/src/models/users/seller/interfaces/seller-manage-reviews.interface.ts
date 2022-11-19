import { Review } from 'src/models/review/schema/review.schema';

export interface SellerReviewsBehaviors {
	//* List seller reviews
	listSellerReviews(sellerId: string): Promise<Review[]>;
}
