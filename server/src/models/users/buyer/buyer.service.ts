import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuctionValidationService } from 'src/models/auction/auction-validation.service';
import { AuctionsService } from 'src/models/auction/auctions.service';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { CreateReviewDto, UpdateReviewDto } from 'src/models/review/dto';
import { ReviewService } from 'src/models/review/review.service';
import { Review } from 'src/models/review/schema/review.schema';
import { Buyer, BuyerDocument } from './schema/buyer.schema';
import { ListBidderAuctionsQueryDto } from './dto';
import { BidderAuctionsEnumQuery } from './enums';
import { ImageType, ResponseResult } from 'src/common/types';
import { UserUpdateDto } from '../shared-user/dto/update-user.dto';
import { CloudinaryService } from 'src/providers/files-upload/cloudinary.service';
import { ChangePasswordDto } from '../shared-user/dto';
import { compare } from 'bcryptjs';

@Injectable()
export class BuyerService {
	private readonly logger: Logger = new Logger(BuyerService.name);
	constructor(
		@InjectModel(Buyer.name)
		private readonly buyerModel: Model<BuyerDocument>,
		private readonly auctionValidationService: AuctionValidationService,
		@Inject(forwardRef(() => AuctionsService)) // To avoid Circular dependency between the two services
		private readonly auctionService: AuctionsService,
		private readonly reviewService: ReviewService,
		private cloudinary: CloudinaryService,
	) {}

	/* Profile Functions Logic */
	async getProfile(buyerId: string): Promise<Buyer> {
		//* Find buyer and populate his joined auctions
		const buyer = await this.buyerModel.findById(buyerId).populate([
			{
				path: 'joinedAuctions',
				populate: ['category', 'seller'],
			},
			{
				path: 'savedAuctions',
				populate: ['category', 'seller'],
			},
		]);

		if (!buyer) {
			throw new BadRequestException('No Bidder With That Id ❌');
		}

		return buyer;
	}

	/**
	 * Edit buyer profile
	 * @param buyerId
	 * @param updateBuyerDto
	 * @returns ResponseResult
	 */
	async editProfile(
		buyerId: string,
		updateBuyerDto: UserUpdateDto,
	): Promise<ResponseResult> {
		//* Check if buyer upload new image to upload it to cloudinary
		let image: ImageType;
		let imageUpdated = false;
		if (updateBuyerDto.image) {
			imageUpdated = true;
			this.logger.debug('Uploading image to cloudinary...');

			try {
				// Upload image to cloudinary
				const savedImage = await this.cloudinary.uploadImage(
					updateBuyerDto.image,
				);

				//* If upload success, save image url and public id to db
				if (savedImage.url) {
					this.logger.log('User Image uploaded successfully!');

					image = new ImageType(savedImage.url, savedImage.public_id);
				}
			} catch (error) {
				this.logger.error('Cannot upload user image to cloudinary ❌');
				throw new BadRequestException('Cannot upload image to cloudinary ❌');
			}

			//* Override image field to the uploaded image
			updateBuyerDto.image = image;
		}

		//* Find the buyer and update his data
		const buyer = await this.buyerModel.findById(buyerId);

		if (!buyer) {
			throw new BadRequestException('No Bidder With That Id ❌');
		}

		//? Remove old image if there was one
		if (imageUpdated && buyer.image?.publicId) {
			//* Remove the image by public id
			await this.cloudinary.destroyImage(buyer.image.publicId);
		}

		//* Update buyer data
		const updatesKeys = Object.keys(updateBuyerDto);
		updatesKeys.forEach(update => (buyer[update] = updateBuyerDto[update]));

		//* Save updated buyer
		await buyer.save();

		return {
			success: true,
			message: 'Buyer data updated successfully ✔✔',
		};
	}

	/**
	 * Change bidder password
	 * @param changePasswordDto
	 * @param bidderId
	 */
	async changePassword(
		{ oldPassword, newPassword }: ChangePasswordDto,
		bidderId: string,
	): Promise<ResponseResult> {
		//* Find the bidder and update his data
		const bidder = await this.buyerModel.findById(bidderId);

		if (!bidder) {
			throw new BadRequestException('No Bidder With That Id ❌');
		}

		//? Check if the password matches or not
		const isMatch = await compare(oldPassword, bidder.password);
		if (!isMatch) {
			return {
				success: false,
				message: 'Old password is incorrect ❌',
			};
		}

		//* Update bidder password
		bidder.password = newPassword;

		//* Save updated bidder
		await bidder.save();

		return {
			success: true,
			message: 'Password changed successfully ✔✔',
		};
	}
	/* Auctions Functions Logic */

	/**
	 * List all the auctions that the bidder joined
	 * @param buyer -
	 * @returns List all joined auctions
	 */
	async listBidderJoinedAuctions(
		buyerId: string,
		populateField: BidderAuctionsEnumQuery,
	): Promise<any> {
		const buyer = await this.buyerModel.findById(buyerId).populate({
			path: populateField,
			populate: ['category', 'seller', 'item', 'winningBuyer'],
		});

		if (!buyer) {
			throw new BadRequestException('No Bidder With That Id ❌');
		}

		let result;
		if (populateField == BidderAuctionsEnumQuery.JoinedAuction) {
			result = buyer.joinedAuctions;

			return { joinedAuctions: result };
		} else if (populateField == BidderAuctionsEnumQuery.SavedAuctions) {
			result = buyer.savedAuctions;
			return { savedAuctions: result };
		}
	}

	/**
	 * Add the bidder to the list of auction's bidders
	 * @param buyer - Bidder object
	 * @param auctionId - Wanted auction
	 * @returns result
	 */
	async joinAuction(buyer: Buyer, auctionId: string) {
		this.logger.debug('Try to add ' + buyer.email + ' to auction users list!');

		//? Validate the data first
		const validationResult =
			await this.auctionValidationService.validateBidderJoinAuction(
				auctionId,
				buyer._id,
			);

		//? If there is validation error, throw an exception
		if (!validationResult.success) {
			throw new BadRequestException(validationResult.message);
		}

		//* Block the assurance of the auction from bidder wallet
		await this.auctionService.blockAssuranceFromWallet(auctionId, buyer);

		/*
			START ADDING BIDDER TO AUCTION
		*/

		//* Add the buyer to the list of auction's bidders
		let isAdded: boolean = await this.auctionService.appendBidder(
			auctionId,
			buyer._id.toString(),
		);

		if (!isAdded) {
			throw new BadRequestException(
				"Cannot append this bidder to the list of auction's bidders 😪❌",
			);
		}

		//* Add the auction to the list of joined auctions
		isAdded = await this.appendAuctionInJoinedAuctions(
			auctionId,
			buyer._id.toString(),
		);

		if (!isAdded) {
			throw new BadRequestException(
				"Cannot append this auctions to the list of joined auction's 😪❌",
			);
		}

		return { success: true, message: 'Bidder joined successfully ✔' };
	}

	/**
	 * Get buyer joined auctions
	 * @param buyerId
	 * @returns List of all joined auctions
	 */
	async listMyAuctions(buyerId: string): Promise<Auction[]> {
		//* Find the buyer and populate the array
		const buyerDoc = await this.buyerModel
			.findById(buyerId)
			.populate('joinedAuctions');

		//* Return only the joinedAuctions array
		return buyerDoc?.joinedAuctions;
	}

	async retreatFromAuction(buyer: Buyer, id: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	/**
	 * Save the auction to be notified when start
	 * @param buyer - buyerId
	 * @param auctionId
	 */
	async saveAuctionForLater(
		buyer: Buyer,
		auctionId: string,
	): Promise<ResponseResult> {
		this.logger.debug(`Try to append ${buyer.name} to auction's waiting list!`);

		//? Validate the data first
		const validationResult =
			await this.auctionValidationService.validateBidderSaveAuction(
				auctionId,
				buyer._id.toString(),
			);

		//? If there is validation error, throw an exception
		if (!validationResult.success) {
			throw new BadRequestException(validationResult.message);
		}

		//* Add the buyer to the list of auction's bidders
		let isAdded: boolean = await this.auctionService.addBidderToWaitingList(
			auctionId,
			buyer._id.toString(),
		);

		if (!isAdded) {
			throw new BadRequestException(
				"Cannot append this bidder auction's waiting list 😪❌",
			);
		}

		//* Add the auction to the list of joined auctions
		isAdded = await this.appendAuctionInSavedAuctions(
			auctionId,
			buyer._id.toString(),
		);

		if (!isAdded) {
			throw new BadRequestException('Cannot save this auction right now');
		}

		return {
			success: true,
			message:
				'Auction saved successfully, you will be notified when auction start.',
		};
	}

	/**
	 * Check if given auction is saved or not
	 * @param buyer
	 * @param auctionId
	 */
	async isSavedAuction(
		buyer: Buyer,
		auctionId: string,
	): Promise<ResponseResult> {
		this.logger.debug(`Check if ${buyer.name} is saved auction ${auctionId}!`);

		const savedAuction = await this.buyerModel.countDocuments({
			_id: buyer._id,
			savedAuctions: auctionId,
		});

		return savedAuction == 0
			? {
					success: false,
					message: 'Auction is not saved ✖✖',
			  }
			: {
					success: true,
					message: 'Auction is saved ✔✔',
			  };
	}

	/**
	 * Add given auctions to list of bidder's joined auctions
	 * @param auctionId
	 * @param bidderId
	 * @return Promise<boolean>
	 */
	private async appendAuctionInJoinedAuctions(
		auctionId: string,
		bidderId: string,
	): Promise<boolean> {
		const updatedBidder = await this.buyerModel.findByIdAndUpdate(
			bidderId,
			{
				$push: { joinedAuctions: auctionId },
			},
			{ new: true },
		);

		return updatedBidder != null;
	}

	/**
	 * Remove auction from joined auctions list (Fires when bidder request to leave auction)
	 * @param _id
	 * @param auctionId
	 */
	public async removeAuctionFromJoinedAuctions(
		bidderId: string,
		auctionId: string,
	): Promise<boolean> {
		const updatedBidder = await this.buyerModel.findByIdAndUpdate(
			bidderId,
			{
				$pull: { joinedAuctions: auctionId },
			},
			{ new: true },
		);

		return updatedBidder != null;
	}

	/**
	 * Save auction to get notified when start
	 * @param auctionId
	 * @param bidderId
	 * @returns Promise<boolean>
	 */
	private async appendAuctionInSavedAuctions(
		auctionId: string,
		bidderId: string,
	): Promise<boolean> {
		const updatedBidder = await this.buyerModel.findByIdAndUpdate(
			bidderId,
			{
				$push: { savedAuctions: auctionId },
			},
			{ new: true },
		);

		return updatedBidder != null;
	}

	/**
	 * Remove auction from bidders saved auctions list
	 * @param auctionId
	 */
	public async removeAuctionFromSavedAuctions(auctionId: string) {
		this.logger.debug(
			`Try to remove auction ${auctionId} from saved auctions for all bidders!`,
		);
		//* Remove auction from savedAuctions for all bidders
		await this.buyerModel.updateMany(
			{
				savedAuctions: auctionId,
			},
			{
				$pull: { savedAuctions: auctionId },
			},
		);
	}

	/*------------------------------*/
	/* Review Functions Logic */

	/**
	 * Create new review in seller
	 * @param createReviewDto
	 * @param buyerId
	 * @param sellerId
	 * @returns created review
	 */
	async makeReview(
		createReviewDto: CreateReviewDto,
		buyerId: string,
	): Promise<Review> {
		this.logger.log(
			'Creating new review in' + createReviewDto.seller + ' from ' + buyerId,
		);

		return this.reviewService.create(createReviewDto, buyerId);
	}

	/**
	 * Get review on specific seller
	 * @param buyerId
	 * @param sellerId
	 * @returns - Review if found
	 */
	async getReviewOnSeller(buyerId: string, sellerId: string) {
		return this.reviewService.getReviewInSeller(sellerId, buyerId);
	}

	async editReview(
		id: string,
		UpdateReviewDto: UpdateReviewDto,
		buyerId: string,
	): Promise<Review> {
		return this.reviewService.updateReview(UpdateReviewDto, id, buyerId);
	}

	/**
	 * Remove review by buyer
	 * @param reviewId
	 * @param buyerId
	 * @returns removed review
	 */
	async removeReview(
		reviewId: string,
		buyerId: string,
	): Promise<ResponseResult> {
		return this.reviewService.remove(reviewId, buyerId);
	}

	/*------------------------------*/
}
