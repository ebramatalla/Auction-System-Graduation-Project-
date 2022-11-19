import {
	Injectable,
	Logger,
	BadRequestException,
	Inject,
	forwardRef,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, StringSchemaDefinition } from 'mongoose';
import { AuctionsService } from 'src/models/auction/auctions.service';
import {
	CreateAuctionDto,
	ExtendAuctionTimeDto,
	UpdateAuctionDto,
} from 'src/models/auction/dto';
import {
	Auction,
	AuctionDocument,
} from 'src/models/auction/schema/auction.schema';
import { ComplaintService } from 'src/models/complaint/complaint.service';
import { Review } from 'src/models/review/schema/review.schema';
import { Seller, SellerDocument } from './schema/seller.schema';
import { ReviewService } from 'src/models/review/review.service';
import { CloudinaryService } from 'src/providers/files-upload/cloudinary.service';
import { UserUpdateDto } from '../shared-user/dto/update-user.dto';
import { ImageType, ResponseResult } from 'src/common/types';
import { AuctionStatus } from 'src/models/auction/enums';
import { ChangePasswordDto } from '../shared-user/dto';
import { compare } from 'bcryptjs';

@Injectable()
export class SellerService {
	//? Create logger
	private logger: Logger = new Logger('SellerService');

	constructor(
		@InjectModel(Seller.name)
		private readonly sellerModel: Model<SellerDocument>,
		@Inject(forwardRef(() => AuctionsService)) // To avoid Circular dependency between the two services
		private readonly auctionsService: AuctionsService,
		@Inject(forwardRef(() => ReviewService))
		private readonly reviewService: ReviewService,
		private cloudinary: CloudinaryService,
	) {}

	/* Handle Profile Functions logic*/
	async getProfile(
		sellerId: string,
	): Promise<{ seller: Seller; auctions: Auction[]; reviews: Review[] }> {
		//* Find seller
		const seller = await this.sellerModel.findById(sellerId);
		if (!seller) {
			throw new BadRequestException('No Seller With That Id ❌');
		}

		//* Get seller auctions
		const auctions: Auction[] = await this.listAuctions(seller);

		//* Get seller reviews
		const reviews: Review[] = await this.listSellerReviews(sellerId);

		return { seller, auctions, reviews };
	}

	/**
	 * Edit seller profile data
	 * @param sellerId
	 * @param updateSellerDto
	 * @returns updated seller instance
	 */
	async editProfile(
		sellerId: string,
		updateSellerDto: UserUpdateDto,
	): Promise<ResponseResult> {
		//* Check if seller upload new image to upload it to cloudinary
		let image: ImageType;
		let imageUpdated = false;
		if (updateSellerDto.image) {
			imageUpdated = true;
			this.logger.debug('Uploading image to cloudinary...');

			try {
				// Upload image to cloudinary
				const savedImage = await this.cloudinary.uploadImage(
					updateSellerDto.image,
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
			updateSellerDto.image = image;
		}

		//* Find the seller and update his data
		const seller = await this.sellerModel.findById(sellerId);

		if (!seller) {
			throw new BadRequestException('No Seller With That Id ❌');
		}

		//? Remove old image if there was one
		if (imageUpdated && seller.image?.publicId) {
			//* Remove the image by public id
			await this.cloudinary.destroyImage(seller.image.publicId);
		}

		//* Update seller data
		const updatesKeys = Object.keys(updateSellerDto);
		updatesKeys.forEach(update => (seller[update] = updateSellerDto[update]));

		//* Save updated seller
		await seller.save();

		return {
			success: true,
			message: 'Seller data updated successfully ✔✔',
		};
	}

	/**
	 * Change seller password
	 * @param changePasswordDto
	 * @param sellerId
	 */
	async changePassword(
		{ oldPassword, newPassword }: ChangePasswordDto,
		sellerId: string,
	): Promise<ResponseResult> {
		//* Find the seller and update his data
		const seller = await this.sellerModel.findById(sellerId);

		if (!seller) {
			throw new BadRequestException('No Seller With That Id ❌');
		}

		//? Check if the password matches or not
		const isMatch = await compare(oldPassword, seller.password);
		if (!isMatch) {
			return {
				success: false,
				message: 'Old password is incorrect ❌',
			};
		}

		//* Update seller password
		seller.password = newPassword;

		//* Save updated seller
		await seller.save();

		return {
			success: true,
			message: 'Password changed successfully ✔✔',
		};
	}

	/* Handle Auctions Functions logic*/

	/**
	 * Add new auction to the given seller
	 * @param createAuctionDto - Auction data
	 * @param seller
	 */
	async addAuction(
		createAuctionDto: CreateAuctionDto,
		seller: SellerDocument,
	): Promise<Auction> {
		return this.auctionsService.create(createAuctionDto, seller);
	}

	/**
	 * List seller's auctions
	 */
	async listAuctions(seller: SellerDocument) {
		/*
		 * Populate 'auctions' property to the seller
		 * Also populate item and category documents
		 */
		this.logger.log(
			'Populating auctions on seller and nested item and category...',
		);
		await seller.populate({
			path: 'auctions',
			populate: [
				{
					path: 'item',
				},
				{
					path: 'category',
				},
				{
					path: 'winningBuyer',
				},
			],
		});

		// FIXME: Fix this error
		// @ts-ignore: Unreachable code error
		const auctions: AuctionDocument[] = seller.auctions;

		return auctions;
	}

	/**
	 * Update specific auction for the seller
	 * @param auctionId - Auction id
	 * @param sellerId - Logged in seller id
	 * @param updateAuctionDto - New auction data
	 * @returns Updated auction instance
	 */
	async editAuction(
		auctionId: string,
		sellerId: string,
		updateAuctionDto: UpdateAuctionDto,
	): Promise<Auction> {
		return this.auctionsService.update(auctionId, sellerId, updateAuctionDto);
	}

	/**
	 * Remove auction by id of specific seller
	 * @param auctionId
	 * @param sellerId
	 * @returns deleted auction document
	 */
	async removeAuction(auctionId: string, sellerId: string): Promise<Auction> {
		return this.auctionsService.remove(auctionId, sellerId);
	}

	/**
	 * Send request to extend an auction time
	 * @param auctionId
	 * @param sellerId
	 * @param time
	 * @returns action result of extend auction time
	 */
	async extendAuctionTime(
		auctionId: string,
		sellerId: string,
		extendAuctionTimeDto: ExtendAuctionTimeDto,
	): Promise<ResponseResult> {
		return this.auctionsService.requestExtendAuctionTime(
			auctionId,
			sellerId,
			extendAuctionTimeDto,
		);
	}

	/**
	 * List all sent requests of time extension
	 * @param sellerId
	 */
	async listMyAuctionExtensionTimeRequests(
		seller: SellerDocument,
	): Promise<any> {
		this.logger.log('Getting seller time extension requests... ');

		await seller.populate({
			path: 'auctions',
		});

		// @ts-ignore: Unreachable code error
		const auctions: AuctionDocument[] = seller.auctions;

		//* Filter the auctions to get the requests
		const requests: AuctionDocument[] = auctions.filter(auction => {
			if (
				auction.status === AuctionStatus.OnGoing &&
				//* Approved
				(auction.isExtended ||
					//* Rejected
					auction.rejectionMessage ||
					//* Pending
					auction.extensionTime)
			) {
				return true;
			}
		});

		//* Return only specific data
		const serializedRequests = requests.map((auction: Auction) => {
			return {
				_id: auction._id,
				extensionTime: auction.extensionTime,
				isExtended: auction.isExtended,
				rejectionMessage: auction.rejectionMessage,
				endDate: auction.endDate,
				status: auction.status,
				requestStatus: auction.isExtended
					? 'approved'
					: auction.rejectionMessage
					? 'rejected'
					: 'pending',
			};
		});

		return serializedRequests;
	}

	/* Handle Reviews Functions logic */

	/**
	 * List all seller reviews
	 * @param sellerId
	 * @returns Array of reviews for that seller
	 */
	async listSellerReviews(sellerId: string) {
		return this.reviewService.getSellerReviews(sellerId);
	}

	/**
	 * Accept seller rate and update the rating in db
	 * @param sellerId - Seller id
	 * @param rate - new calculated rating
	 * @returns void
	 */
	async updateSellerRating(sellerId: string | Seller, rate: number) {
		const seller = await this.sellerModel.findByIdAndUpdate(
			sellerId,
			{
				rating: rate,
			},
			{ new: true },
		);

		if (!seller) {
			this.logger.error(`Cannot update ${seller.name} rate.`);
			return;
		}

		this.logger.log(
			`Seller ${seller.name} rating successfully update and become ${seller.rating}`,
		);
	}
}
