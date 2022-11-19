import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { ResponseResult } from 'src/common/types';
import { BuyerService } from '../users/buyer/buyer.service';
import { Seller } from '../users/seller/schema/seller.schema';
import { SellerService } from '../users/seller/seller.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schema/review.schema';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel(Review.name)
		private readonly reviewModel: Model<ReviewDocument>,
		@Inject(forwardRef(() => SellerService)) //? To avoid circular dependency
		private readonly sellerService: SellerService,
		@Inject(forwardRef(() => BuyerService))
		private readonly buyerService: BuyerService, // To avoid Circular dependency between the two services
	) {}

	/**
	 * Submit new review in seller
	 * @param createReviewDto
	 * @param buyer
	 * @returns
	 */
	async create(createReviewDto: CreateReviewDto, buyer: string) {
		//*  get all auctions that the buyer has joined
		const auction = await this.buyerService.listMyAuctions(buyer);
		let canReview = false;
		//* loop through all auctions and check if the seller of this auction is the same seller that come from the Dto
		auction.forEach(async auction => {
			if (auction.seller._id.toString() === createReviewDto.seller.toString()) {
				//* if true then the buyer can review the seller
				canReview = true;
			}
		});
		if (canReview) {
			//? Ensure that the bidder not already reviewed the seller
			const isAlreadyReviewed = await this.reviewModel.findOne({
				seller: createReviewDto.seller,
				buyer,
			});

			if (isAlreadyReviewed) {
				throw new BadRequestException(
					'You Have reviewed this Seller before 😁.',
				);
			}

			//? Create New Review
			const createdReview: ReviewDocument = new this.reviewModel({
				...createReviewDto,
				buyer,
			});

			//* Save Review
			await createdReview.save();

			//* Update seller rating
			await this.updateSellerRating(createReviewDto.seller.toString());

			return createdReview;
		} else {
			throw new BadRequestException(
				`You can not review this seller as you don't join any auction with him 😁`,
			);
		}
	}

	/**
	 * Update buyer review on seller
	 * @param updateReviewDto
	 * @param reviewId
	 * @param buyerId
	 * @returns review if updated
	 */
	async updateReview(
		updateReviewDto: UpdateReviewDto,
		reviewId: string,
		buyerId: string,
	) {
		const isExists = await this.isExist(reviewId, buyerId);

		if (!isExists) {
			throw new BadRequestException('Not reviewed form You ❌');
		}

		const review = await this.reviewModel.findByIdAndUpdate(
			reviewId,
			updateReviewDto,
			{
				new: true,
			},
		);

		//* Update seller rating
		await this.updateSellerRating(review.seller);

		return review;
	}

	/**
	 * Get buyer review in a seller
	 * @param sellerId
	 * @param buyerId
	 * @returns review if exists
	 */
	async getReviewInSeller(sellerId: string, buyerId: string) {
		const review = await this.reviewModel.findOne({
			seller: sellerId,
			buyer: buyerId,
		});

		if (!review) {
			throw new BadRequestException(
				'No review from this buyer in this seller ❌',
			);
		}

		return review;
	}

	/**
	 * Get all reviews for one seller
	 * @returns List of all reviews submitted in a seller
	 */
	async getSellerReviews(sellerId: string) {
		//* Get the reviews of the seller
		const reviews: ReviewDocument[] = await this.reviewModel
			.find({
				seller: String(sellerId),
			})
			.populate('buyer');

		return reviews;
	}

	/**
	 * Remove a review from the database
	 * @param reviewId
	 * @param buyerId
	 * @returns review if removed
	 */
	async remove(reviewId: string, buyerId: string): Promise<ResponseResult> {
		const review: ReviewDocument = await this.reviewModel.findOneAndRemove({
			_id: reviewId,
			buyer: buyerId,
		});

		if (!review) {
			throw new NotFoundException('Review not found❌');
		}

		//* Update seller rating
		await this.updateSellerRating(review.seller);

		return {
			success: true,
			message: 'Review removed successfully ✔️',
		};
	}

	/**
	 * Check if the review exists in the database or not
	 * @param reviewId
	 * @param buyerId
	 * @returns Promise<boolean>
	 */
	async isExist(reviewId: string, buyerId: string): Promise<boolean> {
		//* Count the number of reviews with the given id and buyer id
		const count = await this.reviewModel.countDocuments({
			_id: reviewId,
			buyer: buyerId,
		});

		return count > 0;
	}

	/**
	 * Update seller rating after submitting/removing reviews
	 * @param sellerId - Seller id
	 */
	async updateSellerRating(sellerId: string | Seller) {
		//* Calculate the average rate from db
		const reviewsAverage = await this.reviewModel.aggregate([
			//* First group all records with seller and calc the average
			{ $group: { _id: '$seller', rate: { $avg: '$review' } } },

			//* Then, match only the provided seller id
			{ $match: { _id: sellerId } },
		]);

		//* At default rate and check if there is reviews to update the rate or not
		let rate: any = 3;

		if (reviewsAverage.length !== 0) {
			//* Extract the rate from the array returned
			rate = reviewsAverage[0].rate;

			//* Keep only first float value
			rate = rate.toFixed(1);
		}

		//* Update seller rate in db
		await this.sellerService.updateSellerRating(sellerId, rate);
	}
}
