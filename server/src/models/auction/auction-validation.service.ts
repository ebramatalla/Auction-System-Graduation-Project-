import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { ObjectId, Schema } from 'mongoose';

import { HandleDateService } from 'src/common/utils';
import { CategoryService } from '../category/category.service';
import { ItemService } from '../items/item.service';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto';

@Injectable()
export class AuctionValidationService {
	constructor(
		@Inject(forwardRef(() => AuctionsService)) // To avoid Circular dependency between the two services
		private readonly auctionService: AuctionsService,
		@Inject(forwardRef(() => CategoryService)) // To avoid Circular dependency between the two services
		private readonly categoryService: CategoryService,
	) {}

	public async validateCreateAuctionData(createAuctionDto: CreateAuctionDto) {
		const validationResult = { success: true, message: undefined };

		//* Get the item data and category data
		const {
			item: itemData,
			category: categoryId,
			startDate,
			...restAuctionData
		} = createAuctionDto;

		//? Ensure that the start date is valid
		const isValidStartDate =
			HandleDateService.isValidAuctionStartDate(startDate);

		if (!isValidStartDate) {
			validationResult.success = false;
			validationResult.message =
				'Invalid start date 😪, It must be between Today and up to 2 months 📅';

			return validationResult;
		}

		//? Ensure that the category exists
		const isCategoryExists = await this.categoryService.isExists(categoryId);
		if (!isCategoryExists) {
			validationResult.success = false;
			validationResult.message = 'Category not found ❌.';

			return validationResult;
		}

		return validationResult;
	}

	public async validateBidderJoinAuction(
		auctionId: string,
		bidderId: ObjectId,
	) {
		const validationResult = { success: true, message: undefined };

		//? Ensure that auction is available to join (is currently ongoing)
		const isAvailable = await this.auctionService.isValidAuctionForBidding(
			auctionId,
		);
		if (!isAvailable) {
			validationResult.success = false;
			validationResult.message =
				'This auction currently is not available to join ❌❌';

			return validationResult;
		}

		//? Ensure that the bidder is not already joined
		const isAlreadyJoined = await this.auctionService.isAlreadyJoined(
			auctionId,
			bidderId.toString(),
		);
		if (isAlreadyJoined) {
			validationResult.success = false;
			validationResult.message =
				'You are already joined this auction before 🙂';

			return validationResult;
		}

		//?Ensure that the buyer has auction's assurance in his wallet
		const hasMinAssurance = await this.auctionService.hasMinAssurance(
			auctionId,
			bidderId.toString(),
		);
		if (!hasMinAssurance) {
			validationResult.success = false;
			validationResult.message =
				'Sorry, you do not have enough balance to pay auction assurance 😑';

			return validationResult;
		}

		return validationResult;
	}

	/**
	 * Run all validation before adding bidder to auction's waiting list
	 * @param auctionId
	 * @param bidderId
	 * @returns validationResult: {success: boolean, message: string}
	 */
	public async validateBidderSaveAuction(auctionId: string, bidderId: string) {
		const validationResult = { success: true, message: undefined };

		//? Ensure that auction is available to save (is currently upcoming)
		const isAvailable = await this.auctionService.isAvailableToSave(auctionId);
		if (!isAvailable) {
			validationResult.success = false;
			validationResult.message =
				'This auction currently is not available to save ❌❌';

			return validationResult;
		}

		//? Ensure that the bidder is not already in auction waiting list
		const isAlreadyJoined = await this.auctionService.isAlreadyInWaitingList(
			auctionId,
			bidderId,
		);

		if (isAlreadyJoined) {
			validationResult.success = false;
			validationResult.message = 'You are already auction waiting list 🙂';

			return validationResult;
		}

		return validationResult;
	}
}
