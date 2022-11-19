import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
	GetCurrentUserData,
	IsPublicRoute,
	Roles,
} from 'src/common/decorators';
import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { Serialize } from 'src/common/interceptors';
import { AuctionDto, CreateAuctionDto } from 'src/models/auction/dto';
import { CreateReviewDto } from 'src/models/review/dto/create-review.dto';
import { ReviewDto } from 'src/models/review/dto/review.dto';
import { UpdateReviewDto } from 'src/models/review/dto/update-review.dto';
import { Review } from 'src/models/review/schema/review.schema';
import { Role } from '../shared-user/enums';
import { BuyerService } from './buyer.service';
import { BuyerDto, ListBidderAuctionsQueryDto } from './dto';
import {
	BuyerAuctionsBehaviors,
	BuyerProfileBehaviors,
	BuyerReviewsBehaviors,
} from './interfaces';
import { Buyer, BuyerDocument } from './schema/buyer.schema';
import { FindReviewInSeller } from './../../review/dto/find-review-in-seller.dto';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { ResponseResult } from 'src/common/types';
import { FormDataRequest } from 'nestjs-form-data';
import { UserUpdateDto } from '../shared-user/dto/update-user.dto';
import { ChangePasswordDto } from '../shared-user/dto';

@ApiTags('Buyer')
@Controller('buyer')
export class BuyerController
	implements
		BuyerAuctionsBehaviors,
		BuyerReviewsBehaviors,
		BuyerProfileBehaviors
{
	constructor(private readonly buyerService: BuyerService) {}

	/* Handle Profile Functions */

	@IsPublicRoute()
	@Get('profile/:id')
	@Serialize(BuyerDto)
	@HttpCode(HttpStatus.OK)
	async getProfile(@Param() { id: buyerId }: MongoObjectIdDto): Promise<Buyer> {
		return this.buyerService.getProfile(buyerId);
	}

	@Roles(Role.Buyer)
	@Patch('profile')
	@FormDataRequest() // Comes from NestjsFormDataModule (Used to upload files)
	editProfile(
		@Body() userUpdateDto: UserUpdateDto,
		@GetCurrentUserData('_id') buyerId: string,
	): Promise<ResponseResult> {
		return this.buyerService.editProfile(buyerId, userUpdateDto);
	}

	@Roles(Role.Buyer)
	@Patch('profile/change-password')
	changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@GetCurrentUserData('_id') bidderId: string,
	): Promise<ResponseResult> {
		return this.buyerService.changePassword(changePasswordDto, bidderId);
	}

	/* Handle Auctions Functions */
	@Roles(Role.Buyer, Role.Admin, Role.Employee)
	@Get('auctions')
	@Serialize(BuyerDto)
	listBidderAuctions(
		@Query() { buyerId, populateField }: ListBidderAuctionsQueryDto,
	): Promise<any> {
		console.log({ buyerId });

		return this.buyerService.listBidderJoinedAuctions(
			buyerId.toString(),
			populateField,
		);
	}

	@Roles(Role.Buyer)
	@Post('auction/join/:id')
	@HttpCode(HttpStatus.OK)
	joinAuction(
		@GetCurrentUserData() buyer: Buyer,
		@Param() { id }: MongoObjectIdDto,
	) {
		return this.buyerService.joinAuction(buyer, id);
	}

	@Roles(Role.Buyer)
	@Serialize(AuctionDto)
	@Get('auctions')
	listMyAuctions(
		@GetCurrentUserData('_id') buyerId: string,
	): Promise<Auction[]> {
		return this.buyerService.listMyAuctions(buyerId);
	}

	@Roles(Role.Buyer)
	@Serialize(AuctionDto)
	@Post('auction/retreat/:id')
	@HttpCode(HttpStatus.OK)
	retreatFromAuction(
		@GetCurrentUserData() buyer: Buyer,
		@Param() { id }: MongoObjectIdDto,
	): Promise<boolean> {
		return this.buyerService.retreatFromAuction(buyer, id);
	}

	@Roles(Role.Buyer)
	@Post('auction/save/:id')
	@HttpCode(HttpStatus.OK)
	saveAuctionForLater(
		@GetCurrentUserData() buyer: Buyer,
		@Param() { id }: MongoObjectIdDto,
	): Promise<ResponseResult> {
		return this.buyerService.saveAuctionForLater(buyer, id);
	}

	@Roles(Role.Buyer)
	@Get('auction/is-saved/:id')
	@HttpCode(HttpStatus.OK)
	isSavedAuction(
		@GetCurrentUserData() buyer: Buyer,
		@Param() { id: auctionId }: MongoObjectIdDto,
	): Promise<ResponseResult> {
		return this.buyerService.isSavedAuction(buyer, auctionId);
	}

	/*--------------------*/

	/* Review Behaviors */
	@Roles(Role.Buyer)
	@Serialize(ReviewDto)
	@Post('review')
	submitReviewOnSeller(
		@Body() createReviewDto: CreateReviewDto,
		@GetCurrentUserData('_id') buyerId: string,
	): Promise<Review> {
		return this.buyerService.makeReview(createReviewDto, buyerId);
	}

	@Roles(Role.Buyer)
	@Serialize(ReviewDto)
	@Get('review')
	getReviewOnSeller(
		@Query() { sellerId }: FindReviewInSeller,
		// @Query() sellerId: string,
		@GetCurrentUserData('_id') buyerId: string,
	): Promise<Review> {
		return this.buyerService.getReviewOnSeller(buyerId, sellerId);
	}

	@Roles(Role.Buyer)
	@Serialize(ReviewDto)
	@Patch('review/:id')
	editReview(
		@Param() { id }: MongoObjectIdDto,
		@Body() updateReviewDto: UpdateReviewDto,
		@GetCurrentUserData('_id') buyerId: string,
	): Promise<Review> {
		return this.buyerService.editReview(id, updateReviewDto, buyerId);
	}

	@Roles(Role.Buyer)
	@Serialize(ReviewDto)
	@Delete('review/:id')
	deleteReview(
		@Param() { id }: MongoObjectIdDto,
		@GetCurrentUserData('_id') buyerId: string,
	): Promise<ResponseResult> {
		return this.buyerService.removeReview(id, buyerId);
	}
}
