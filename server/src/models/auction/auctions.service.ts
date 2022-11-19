import {
	BadRequestException,
	Injectable,
	NotFoundException,
	Logger,
	forwardRef,
	Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemService } from '../items/item.service';
import { Seller } from '../users/seller/schema/seller.schema';
import {
	CreateAuctionDto,
	ExtendAuctionTimeDto,
	FilterAuctionQueryDto,
	RejectAuctionDto,
	UpdateAuctionDto,
} from './dto';
import { AuctionStatus } from './enums';
import { Auction, AuctionDocument } from './schema/auction.schema';
import { AuctionValidationService } from './auction-validation.service';
import { AuctionSchedulingService } from 'src/providers/schedule/auction/auction-scheduling.service';
import WalletService from 'src/providers/payment/wallet.service';
import { Bid } from '../bids/schema/bid.schema';
import { BiddingIncrementRules } from 'src/providers/bids';
import {
	AdminManageAuctionsBehaviors,
	BiddingBehaviors,
	MainAuctionsBehaviors,
	ScheduleAuctionsBehaviors,
} from './interfaces';
import { AdminFilterAuctionQueryDto } from '../users/admin/dto';
import { DashboardAuctionsCount } from './types';
import { ResponseResult } from 'src/common/types';
import { HandleDateService } from './../../common/utils/date/handle-date.service';
import { Buyer } from '../users/buyer/schema/buyer.schema';
import { BuyerService } from '../users/buyer/buyer.service';
import { CategoryService } from '../category/category.service';
import { AuctionEmailsService } from 'src/providers/mail';

@Injectable()
export class AuctionsService
	implements
		MainAuctionsBehaviors,
		AdminManageAuctionsBehaviors,
		ScheduleAuctionsBehaviors,
		BiddingBehaviors
{
	private logger: Logger = new Logger('AuctionsService 👋🏻');

	constructor(
		@InjectModel(Auction.name)
		private readonly auctionModel: Model<AuctionDocument>,
		private readonly buyerService: BuyerService,
		private readonly auctionValidationService: AuctionValidationService,
		private readonly biddingIncrementRules: BiddingIncrementRules,
		private readonly itemService: ItemService,
		@Inject(forwardRef(() => CategoryService))
		private readonly categoryService: CategoryService,
		private readonly auctionSchedulingService: AuctionSchedulingService,
		private readonly walletService: WalletService,
		private readonly auctionEmailsService: AuctionEmailsService,
	) {}

	/* Handle Main Auctions Methods */

	/**
	 * Create new auction
	 * @param createAuctionDto
	 * @param seller - Seller who created the auction
	 */
	async create(
		createAuctionDto: CreateAuctionDto,
		seller: Seller,
	): Promise<Auction> {
		//? Validate the data first
		const validationResult =
			await this.auctionValidationService.validateCreateAuctionData(
				createAuctionDto,
			);

		//? If there is validation error, throw an exception
		if (!validationResult.success) {
			throw new BadRequestException(validationResult.message);
		}

		//* Create new item with this data
		const createdItem = await this.itemService.create(createAuctionDto.item);

		//? Set the Minimum Bid Allowed to be equal to the basePrice.
		const MinBidAllowed = createAuctionDto.basePrice;

		//? Calc tha chair cost value
		const chairCostValue = this.calculateChairCost(createAuctionDto.basePrice);

		//* Create new auction document
		const createdAuction: AuctionDocument = new this.auctionModel({
			title: createAuctionDto.title,
			basePrice: createAuctionDto.basePrice,
			startDate: createAuctionDto.startDate,
			minimumBidAllowed: MinBidAllowed,
			chairCost: chairCostValue,
			item: createdItem,
			category: createAuctionDto.category,
			seller,
		});

		//* Save the instance
		await createdAuction.save();

		this.logger.log('New auction created and now waiting for approval ✔✔');

		return createdAuction;
	}

	/**
	 * Find all auctions
	 * @Param filterAuctionQuery - Contains search criteria
	 * @returns List of all existing auctions
	 */
	async findAll(
		filterAuctionQuery?: FilterAuctionQueryDto | AdminFilterAuctionQueryDto,
	): Promise<Auction[]> {
		let populateFields = [];

		//* Check if the user want to populate the nested docs
		const wantToPopulate = filterAuctionQuery?.populate;
		if (wantToPopulate) {
			populateFields = [
				'seller',
				'category',
				'item',
				'winningBuyer',
				'bidders',
				'waitingBidders',
			];

			// Delete the populate fields from the filterAuctionQuery
			delete filterAuctionQuery.populate;
		}

		//? Check if the category name provided to get its id
		if (filterAuctionQuery?.category) {
			const categoryId = await this.categoryService.getCategoryIdByName(
				filterAuctionQuery.category,
			);

			if (categoryId) {
				filterAuctionQuery.category = categoryId.toString();
			} else {
				delete filterAuctionQuery.category;
			}
		}

		const auctions = await this.auctionModel
			.find(filterAuctionQuery)
			.populate(populateFields);

		return auctions;
	}

	/**
	 * Find auction by id
	 * @param _id - Auction id
	 * @returns Auction instance if found, NotFoundException thrown otherwise.
	 */
	async findById(_id: string): Promise<Auction> {
		const auction = await this.auctionModel
			.findById(_id)
			.populate(['seller', 'category', 'item', 'winningBuyer', 'bidders'])
			.exec();

		if (!auction) throw new NotFoundException('Auction not found ❌');

		return auction;
	}

	/**
	 * Get list of auctions by their status
	 * @param status
	 * @returns Array of auctions
	 */
	async getAuctionByStatus(status: AuctionStatus): Promise<AuctionDocument[]> {
		const auctions = await this.auctionModel.find({ status });

		return auctions ? auctions : [];
	}

	/**
	 * Get list of auctions by category
	 * @param categoryId
	 * @returns Array of auctions
	 */
	async getAuctionByCategory(categoryId: string): Promise<AuctionDocument[]> {
		const auctions = await this.auctionModel
			.find({ category: categoryId })
			.populate(['seller', 'category', 'item', 'winningBuyer']);

		return auctions ? auctions : [];
	}

	/**
	 * Get auctions count for specific category
	 * @param categoryId
	 * @returns
	 */
	async getCategoryAuctionsCount(categoryId: string): Promise<number> {
		//* Get count of auction in specific category
		const count = await this.auctionModel.countDocuments({
			category: categoryId,
		});

		return count;
	}

	/**
	 * Update auction details
	 * @param auctionId - Auction id
	 * @param sellerId - Seller id
	 * @param updateAuctionDto - Dto for auction's properties to be updated
	 * @returns updated auction instance
	 */
	async update(
		auctionId: string,
		sellerId: string,
		{ item: itemNewData, ...updateAuctionDto }: UpdateAuctionDto,
	): Promise<Auction> {
		//* Get the auction for this seller
		const auction = await this.auctionModel.findOne({
			_id: auctionId,
			seller: sellerId,
		});

		if (!auction)
			throw new NotFoundException('Auction not found for this seller❌');

		//* Ensure that the auction is in one of the following states (Upcoming, Pending, Rejected)
		const permittedStatus = [
			AuctionStatus.UpComing,
			AuctionStatus.Pending,
			AuctionStatus.Denied,
		];

		if (!permittedStatus.includes(auction.status)) {
			throw new BadRequestException(
				'Cannot update the auction in current status ❌',
			);
		}

		//? Update the item first if it changed
		if (itemNewData) {
			await this.itemService.update(itemNewData._id, itemNewData);
		}

		//* Add the status to the object and set it back to 'pending'
		updateAuctionDto['status'] = AuctionStatus.Pending;

		//* Find the auction and update it
		const updatedAuction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			updateAuctionDto,
			{ new: true },
		);

		return updatedAuction;
	}

	/**
	 * Remove auction by id
	 * @param auctionId
	 * @param sellerId
	 * @returns Deleted auction instance
	 */
	async remove(auctionId: string, sellerId: string): Promise<Auction> {
		this.logger.log('Removing auction with id ' + auctionId + '... 🚚');

		const auction: AuctionDocument = await this.auctionModel.findOne({
			_id: auctionId,
			seller: sellerId,
		});
		if (!auction)
			throw new NotFoundException('Auction not found for that seller❌');

		//* Ensure that the auction is in one of the following states (Upcoming, Pending, Rejected)
		const permittedStatus = [
			AuctionStatus.UpComing,
			AuctionStatus.Pending,
			AuctionStatus.Denied,
			AuctionStatus.Closed,
		];

		if (!permittedStatus.includes(auction.status)) {
			throw new BadRequestException(
				'Cannot remove currently running auction ❌',
			);
		}

		//* Remove the auction using this approach to fire the pre hook event
		await auction.remove();

		return auction;
	}

	/**
	 * Extend the auction by adding more time
	 * @param auctionId
	 * @param sellerId
	 * @param extendAuctionTimeDto: ExtendAuctionTimeDto,
	 * @returns Promise<ResponseResult>
	 */
	async requestExtendAuctionTime(
		auctionId: string,
		sellerId: string,
		extendAuctionTimeDto: ExtendAuctionTimeDto,
	) {
		//* Get auction for the seller
		let auction = await this.auctionModel.findOne({
			_id: auctionId,
			seller: sellerId,
		});

		if (!auction)
			throw new NotFoundException('Auction not found for that seller❌');

		if (auction.status !== AuctionStatus.OnGoing) {
			throw new BadRequestException('Auction not started yet ✖✖');
		}

		if (auction.isExtended) {
			throw new BadRequestException('Auction already extended before ❌');
		}

		//* Add the time to the auction
		await this.auctionModel.findByIdAndUpdate(auctionId, {
			extensionTime: extendAuctionTimeDto,
			rejectionMessage: null,
		});

		this.logger.log(
			'Time extension request sent and now waiting for approval ✔✔',
		);

		return {
			success: true,
			message: 'Time extension request sent and now waiting for approval ✔✔',
		};
	}

	/**
	 * Get all auctions with time extension requests
	 * @returns Array of auctions with time extension requests
	 */
	async getAuctionsTimeExtensionRequests(): Promise<any> {
		//* Get all auctions with time extension not equal null
		const auctions: Auction[] = await this.auctionModel
			.find({
				extensionTime: { $ne: null },
				isExtended: false,
			})
			.populate('seller');

		//* Return only specific data
		const serializedRequests = auctions.map((auction: Auction) => {
			return {
				_id: auction._id,
				seller: {
					_id: auction.seller._id,
					name: auction.seller.name,
				},
				extensionTime: auction.extensionTime,
				endDate: auction.endDate,
				status: auction.status,
			};
		});

		return serializedRequests;
	}

	/**
	 * Enable admin to approve time extension request
	 */
	async approveTimeExtensionRequest(
		auctionId: string,
	): Promise<ResponseResult> {
		//* Find only auctions that not closed or denied
		const auction = await this.auctionModel.findOne({
			_id: auctionId,
			isExtended: false,
		});

		if (!auction)
			return {
				success: false,
				message: 'Auction not found or already extended before ❌',
			};

		//* Get auction new end date after extension time is added
		const newEndDate = HandleDateService.appendExtensionAndGetNewEndDate(
			auction.endDate,
			auction.extensionTime,
		);

		const updatedAuction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				endDate: newEndDate,
				isExtended: true,
				rejectionMessage: null,
			},
			{ new: true },
		);

		//* Remove current cron job and create new one for the new end date
		this.auctionSchedulingService.deleteCron(auctionId);

		this.auctionSchedulingService.addCronJobForEndAuction(
			auctionId,
			newEndDate,
		);

		if (!updatedAuction) {
			return {
				success: false,
				message: 'Cannot approve this extension time request ❌',
			};
		}

		this.logger.log('Auction extension time request approved successfully ✔✔');

		return {
			success: true,
			message: 'Auction time extend successfully ✔✔',
			data: {
				endDate: updatedAuction.endDate,
			},
		};
	}

	/**
	 * Reject time extension request
	 * @param auctionId
	 * @param rejectExtendTime
	 * @returns if rejected successfully
	 */
	async rejectTimeExtensionRequest(
		auctionId: string,
		rejectExtendTime: RejectAuctionDto,
	): Promise<ResponseResult> {
		//* Find the auction
		const auction = await this.auctionModel.findOne({
			_id: auctionId,
			extensionTime: { $ne: null },
			isExtended: false,
		});

		if (!auction) {
			return {
				success: false,
				message: 'Auction not found or already closed ❌',
			};
		}

		//* reject the extension time request and update the auction and use rejection message to know why it was rejected
		await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				extensionTime: null,
				rejectionMessage: rejectExtendTime.message,
			},
			{ new: true },
		);

		this.logger.log('Auction extension time request rejected successfully ✔✔');

		return {
			success: true,
			message: 'Auction time extension request rejected successfully ✔✔',
		};
	}

	/**
	 * Check if there is any auctions that has status ongoing or upcoming in category
	 * @param categoryId
	 * @return true / false
	 */
	async isThereAnyRunningAuctionRelatedToCategory(
		categoryId: string,
	): Promise<boolean> {
		const auctions = await this.auctionModel.countDocuments({
			category: categoryId,
			status: { $in: [AuctionStatus.OnGoing, AuctionStatus.UpComing] },
		});

		return auctions > 0;
	}

	/**
	 * Remove all auctions related to specific category
	 * @param categoryId - category id
	 */
	async removeAllCategoryAuctions(categoryId: string): Promise<ResponseResult> {
		const auctions = await this.auctionModel.deleteMany({
			category: categoryId.toString(),
		});

		if (!auctions) {
			throw new BadRequestException(
				'Cannot remove auctions related to that category ❌',
			);
		}

		this.logger.log('All auctions related to the category deleted ✔✔ ');

		return { success: true };
	}

	/**
	 * Check if auction exists or not
	 * @param auctionId
	 * @param sellerId
	 * @returns true if auction exists, false otherwise
	 */
	async isExists(auctionId: string, sellerId: string): Promise<boolean> {
		//? Check if the seller owns this auction
		const count = await this.auctionModel.countDocuments({
			_id: auctionId,
			seller: sellerId,
		});

		return count > 0;
	}

	/*---------------------------------------*/
	/* Handle Admin Manage Auctions Methods */
	/**
	 * Approve specific auction
	 * @param auctionId
	 * @return the updated auction
	 */
	async approveAuction(auctionId: string): Promise<ResponseResult> {
		//? Get the auction from db
		const auction = await this.auctionModel.findById(auctionId);
		if (!auction) return null;

		if (auction.status === AuctionStatus.UpComing) {
			throw new BadRequestException('Auction is already approved ✔✔');
		}

		//? Get start HandleDateService
		let auctionStartDate = auction.startDate;

		//* Check if the start date is in the past
		const isStartDateInPast = HandleDateService.isInPast(auctionStartDate);
		if (isStartDateInPast) {
			//* Set the start date to tomorrow
			const tomorrow = HandleDateService.getTomorrowDate();

			auctionStartDate = tomorrow;

			this.logger.debug(
				'Auction start date is in the past ❌, so it is set to tomorrow 🐱‍🏍',
			);
		}

		//* Add 7 days to the startDate
		const newEndDate =
			HandleDateService.getNewEndDateFromStartDate(auctionStartDate);

		//? Find the auction by id and set the status to be UpComing and the new end date
		const approvedAuction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				$set: {
					status: AuctionStatus.UpComing, // Update status to up coming
					startDate: auctionStartDate, // Update start date (if it was in the past)
					endDate: newEndDate, // Update end date
				},
			},
			{ new: true },
		);

		//? Schedule the auction to run in start date automatically
		this.auctionSchedulingService.addCronJobForStartAuction(
			approvedAuction._id,
			approvedAuction.startDate,
		);

		//* Display log message
		this.logger.log(
			'Auction with title ' +
				approvedAuction.title +
				' approved successfully 👏🏻',
		);

		return {
			success: true,
			message: 'Auction approved successfully ✔✔',
			data: {
				startDate: approvedAuction.startDate,
				endDate: approvedAuction.endDate,
			},
		};
	}

	/**
	 * Reject specific auction and supply rejection message
	 * @param auctionId
	 * @param rejectAuctionDto - The rejection message
	 */
	async rejectAuction(
		auctionId: string,
		rejectAuctionDto: RejectAuctionDto,
	): Promise<Auction> {
		const rejectedAuction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				status: AuctionStatus.Denied,
				rejectionMessage: rejectAuctionDto.message,
			},
			{ new: true },
		);

		return rejectedAuction;
	}

	/*
	 * Return auctions count to be displayed into admin dashboard
	 */
	async getAuctionsCount(): Promise<DashboardAuctionsCount> {
		//* Get total count of all auctions
		const auctions = await this.auctionModel.find();

		//* Get the auctions count
		const totalAuctions = auctions.length;

		//* Get count of pending auctions only
		const pendingAuctionsCount: number = auctions.filter(
			auction => auction.status === AuctionStatus.Pending,
		).length;

		//* Get count of ongoing auctions only
		const ongoingAuctionsCount: number = auctions.filter(
			auction => auction.status === AuctionStatus.OnGoing,
		).length;

		//* Get count of upcoming auctions only
		const upcomingAuctionsCount: number = auctions.filter(
			auction => auction.status === AuctionStatus.UpComing,
		).length;

		//* Get count of closed auctions only
		const closedAuctionsCount: number = auctions.filter(
			auction => auction.status === AuctionStatus.Closed,
		).length;

		//* Get count of denied auctions only
		const deniedAuctionsCount: number = auctions.filter(
			auction => auction.status === AuctionStatus.Denied,
		).length;

		return {
			totalAuctions,
			pendingAuctionsCount,
			ongoingAuctionsCount,
			upcomingAuctionsCount,
			closedAuctionsCount,
			deniedAuctionsCount,
		};
	}

	/**
	 * Return all winners bidders to be displayed in admin dashboard
	 */
	async getWinnersBiddersForDashboard(): Promise<any[]> {
		//* Get all auctions with status 'closed'
		const closedAuctions = await this.auctionModel
			.find({
				$and: [
					{ status: AuctionStatus.Closed },
					{ winningBuyer: { $ne: null } },
				],
			})
			.populate('winningBuyer')
			.sort({ startDate: -1 });

		const winnersBidders = [];

		//* return only winningBuyer _id, email, auction title and winningPrice
		closedAuctions.forEach(auction => {
			winnersBidders.push({
				winningBuyer: {
					_id: auction.winningBuyer?._id,
					email: auction.winningBuyer?.email,
				},
				auction: {
					_id: auction._id,
					title: auction.title,
				},
				winningPrice: auction.currentBid,
			});
		});

		return winnersBidders;
	}

	/**
	 * List auctions with highest number of bids
	 * @param top - How many documents to return (default: 5)
	 */
	async getTopAuctionsForDashboard(top?: number): Promise<Auction[]> {
		const topAuctions = await this.auctionModel
			.find({
				$and: [
					{ status: AuctionStatus.OnGoing },
					{ numberOfBids: { $gte: 3 } },
				],
			})
			.populate('category')
			.limit(top || 5)
			.sort({
				numOfBids: -1,
			});

		return topAuctions;
	}

	/*---------------------------------------*/
	/* Handle Schedule Auction Methods */

	/**
	 * Set the auction status to started(current auction)
	 * @param auctionId - Auction id
	 */
	async markAuctionAsStarted(auctionId: string): Promise<boolean> {
		//? Update auction and set the status to be OnGoing.
		const result = await this.updateAuctionStatus(
			auctionId,
			AuctionStatus.OnGoing,
		);

		if (!result) {
			throw new BadRequestException(
				'Unable to start auction, auction not found ❌',
			);
		}

		//* Notify all waiting bidders in that auction
		const auction = await this.auctionModel
			.findById(auctionId)
			.populate(['category', 'waitingBidders']);

		const waitingBidders = auction.waitingBidders;

		if (waitingBidders.length > 0) {
			this.logger.debug("Notify all bidders in auction's waiting list...");

			//* Loop through all waiting bidders and get their email
			const biddersEmails = waitingBidders.map(bidder => {
				return bidder.email;
			});

			//* Send email to all bidders
			await this.auctionEmailsService.notifyBiddersAuctionStart(
				auction,
				biddersEmails,
			);
		}

		this.logger.debug('New auction started and now open to accept bids!!');

		return true;
	}

	/**
	 * Set the auction status to ended(close auction)
	 * @param auctionId
	 */
	async markAuctionAsEnded(auctionId: string): Promise<boolean> {
		//? Update auction and set the status to be closed.
		const result = await this.updateAuctionStatus(
			auctionId,
			AuctionStatus.Closed,
		);

		if (!result) {
			throw new BadRequestException(
				'Unable to end auction, auction not found ❌',
			);
		}

		this.logger.debug('Auction with id ' + auctionId + ' ended successfully!!');

		/*---------------------*/
		// Recover all joined bidders auction assurance (except winner bidder)
		await this.recoverAuctionAssurance(auctionId);

		await this.sendEmailToWinner(auctionId);

		return true;
	}

	/**
	 * Send email to the auction's winner bidder
	 */
	async sendEmailToWinner(auctionId: string): Promise<void> {
		const auction = await this.auctionModel
			.findById(auctionId)
			.populate('winningBuyer seller item category');

		await this.auctionEmailsService.sendToWinnerBidder(
			auction,
			auction.winningBuyer,
		);
	}

	/**
	 * Change auction status to specific status
	 * @param auctionId - Auction id
	 * @param status - Auction status
	 * @returns boolean
	 */
	async updateAuctionStatus(
		auctionId: string,
		status: AuctionStatus,
	): Promise<boolean> {
		//? Find the auction by id and set the status
		const auction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				$set: {
					status: status,
				},
			},
			{ new: true },
		);

		if (!auction) {
			return false;
		}
		return true;
	}

	/**
	 * Get the end date of given auction
	 * @param auctionId - Auction id
	 */
	async getAuctionEndDate(auctionId: string): Promise<any> {
		const endDate = await this.auctionModel
			.findById(auctionId)
			.select('endDate');

		return endDate;
	}

	/*-------------------------------*/
	/* Handle Bidder Related Methods */

	/**
	 * Check if the auction is available for bidding or not
	 * @param auctionId - Auction id
	 * @returns true or false
	 */
	async isValidAuctionForBidding(auctionId: string): Promise<boolean> {
		const count = await this.auctionModel.countDocuments({
			_id: auctionId,
			status: AuctionStatus.OnGoing,
		});

		return count > 0;
	}

	/**
	 * Check if the bidder exists in the auction bidder list or not
	 * @param auctionId - Auction id
	 * @param bidderId - Bidder id
	 * @returns Promise<boolean>
	 */
	async isAlreadyJoined(auctionId: string, bidderId: string): Promise<boolean> {
		const count = await this.auctionModel.countDocuments({
			_id: auctionId,
			bidders: bidderId,
		});

		return count > 0;
	}

	/**
	 * Check if the bidder has the minimum assurance for an auction
	 * @param auctionId
	 * @param bidderId
	 * @returns true if he has, false otherwise
	 */
	async hasMinAssurance(auctionId: string, bidderId: string): Promise<boolean> {
		//* Get the auction
		const auction = await this.auctionModel.findById(auctionId);

		//* Extract the chair cost
		const auctionChairCost = auction.chairCost;

		//* Get buyer wallet balance
		const { balance } = await this.walletService.getWalletBalance(bidderId);

		return balance >= auctionChairCost;
	}

	/**
	 * Transfer
	 * @param auctionId
	 * @param bidder
	 */
	async blockAssuranceFromWallet(
		auctionId: string,
		bidder: Buyer,
	): Promise<boolean> {
		//* Get auction's assurance
		const auction = await this.auctionModel.findById(auctionId);
		const assuranceValue = auction.chairCost;

		await this.walletService.blockAssuranceFromWallet(bidder, assuranceValue);

		return true;
	}

	/**
	 * Add new bidder to the list of auction's bidders
	 * @param auctionId - Auction id
	 * @param bidderId - Bidder id
	 * @returns Promise<boolean>
	 */
	async appendBidder(auctionId: string, bidderId: string): Promise<boolean> {
		const auction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				$push: { bidders: bidderId },
			},
			{ new: true },
		);

		return auction != null;
	}

	/**
	 * Retreat bidder from auction
	 * @param bidder
	 * @param auctionId
	 */
	async retreatBidderFromAuction(
		bidder: Buyer,
		auctionId: string,
	): Promise<ResponseResult> {
		const auction = await this.auctionModel.findOne({
			_id: auctionId,
			status: AuctionStatus.OnGoing,
			bidders: bidder._id,
		});

		if (!auction) {
			return {
				success: false,
				message: 'You are not a bidder of this auction',
			};
		}

		//? Check if the bidder is the winner
		const auctionWinner = auction.winningBuyer;

		if (bidder._id.toString() === auctionWinner?._id.toString()) {
			return {
				success: false,
				message:
					'You cannot retreat from the auction as you have highest bid!!',
			};
		}

		//* Update the auction by pull the bidder from the bidders list
		await this.auctionModel.findByIdAndUpdate(auction._id, {
			$pull: {
				bidders: bidder._id,
			},
		});

		//? Remove the auction from bidder joined auctions list
		await this.buyerService.removeAuctionFromJoinedAuctions(
			bidder._id.toString(),
			auctionId,
		);

		//* Refund assurance to bidder wallet
		await this.walletService.recoverAssuranceToBidder(
			bidder,
			auction.chairCost,
		);

		return {
			success: true,
			message: 'You have been retreated from the auction!!',
		};
	}

	/**
	 * Check if the auction is available to save (it is upcoming)
	 * @param auctionId
	 * @returns true or false
	 */
	async isAvailableToSave(auctionId: string) {
		const count = await this.auctionModel.countDocuments({
			_id: auctionId,
			status: AuctionStatus.UpComing,
		});

		return count > 0;
	}

	/**
	 * Check if the bid value is greater than the minimum allowed bid value or not
	 * @param auctionId - Auction that the bid in
	 * @param bidValue - Incoming bid value
	 * @returns true if bid is greater than current bid, false otherwise
	 * Check if the bidder in auction's waiting list
	 * @param auctionId
	 * @param bidderId
	 * @returns Promise<boolean>
	 */
	async isAlreadyInWaitingList(
		auctionId: string,
		bidderId: string,
	): Promise<boolean> {
		const count = await this.auctionModel.countDocuments({
			_id: auctionId,
			waitingBidders: bidderId,
		});

		return count > 0;
	}

	/**
	 * Add bidder to the auction's waiting list
	 * @param auctionId - Auction id
	 * @param bidderId - Bidder id
	 * @returns Promise<boolean>
	 */
	async addBidderToWaitingList(
		auctionId: string,
		bidderId: string,
	): Promise<boolean> {
		//* push the bidder to the waiting list
		const auction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				$push: { waitingBidders: bidderId },
			},
			{ new: true },
		);

		return auction != null;
	}

	/**
	 * Check if the bid is valid (bidValue > minimum bid value) and auction still ongoing
	 * @param auctionId - Auction id
	 * @param bidValue - incoming bid value
	 * @returns boolean
	 */
	async isValidBid(auctionId: string, bidValue: number): Promise<boolean> {
		//* Get the auction
		const auction = await this.auctionModel.findById(auctionId);

		//* Check if the bid is greater than the current bid and the opening bid
		return bidValue >= auction.minimumBidAllowed;
	}

	/**
	 * Handle new bid (increment bid number on the auction and add the current bid value)
	 * @param auctionId
	 * @param bid
	 */
	async handleNewBid(auctionId: string, bid: Bid): Promise<boolean> {
		//* Calculate the bid increment
		const bidIncrement = this.calcBidIncrement(bid.amount);

		//* Calculate the new minimum bid
		const newMinimumBid = this.calculateMinimumBidAllowed(
			bid.amount,
			bidIncrement,
		);

		//* Find the auction and update it
		const auction = await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				$inc: { numOfBids: 1 }, // Increment the number of bids
				currentBid: bid.amount, // Set the current bid to bid value
				bidIncrement, // Set the bid increment
				minimumBidAllowed: newMinimumBid, // Set the new minimum bid
				winningBuyer: bid.user, // Set the winning bidder
				$push: {
					bids: bid,
				},
			},
			{ new: true },
		);

		if (!auction) {
			throw new NotFoundException('Auction not found❌');
		}

		return auction ? true : false;
	}

	/**
	 * Check if the bid in the last minute in auction
	 * @param auctionId
	 * @param bidDate
	 */
	async handleIfBidInLastMinute(
		auctionId: string,
		bidDate: Date,
	): Promise<ResponseResult> {
		const auction = await this.auctionModel.findById(auctionId.toString());

		if (!auction) {
			return {
				success: false,
				message: 'Auction not found❌',
			};
		}

		const isInLastMinute = HandleDateService.isInLastMinute(
			bidDate,
			auction.endDate,
		);

		if (!isInLastMinute) {
			return {
				success: false,
				message: 'Bid is not in last minute❌',
			};
		}

		//* Append delay to auction endDate
		const newEndDate = HandleDateService.appendDelayToDate(auction.endDate);

		//* Update the auction
		await this.auctionModel.findByIdAndUpdate(
			auctionId,
			{
				endDate: newEndDate,
			},
			{
				new: true,
			},
		);

		//* Remove current cron job and create new one for the new end date
		this.auctionSchedulingService.deleteCron(auctionId);

		this.auctionSchedulingService.addCronJobForEndAuction(
			auctionId,
			newEndDate,
		);

		this.logger.debug(
			`Incoming bid is in last minute, so delay added and new end date: ${newEndDate}`,
		);

		return {
			success: true,
			message: 'Auction delay appended successfully!!',
		};
	}

	/**
	 * Return some of auction details used to be displayed in bidding room
	 * @param auctionId
	 * @returns Auction details
	 */
	async getCurrentAuctionDetailsForBidding(auctionId: string): Promise<any> {
		//* Select specific fields from the auction document
		const auctionDetails = await this.auctionModel
			.findById(auctionId)
			.select(
				'basePrice numOfBids currentBid bidIncrement minimumBidAllowed winningBuyer endDate',
			)
			.populate('winningBuyer');

		//* Return custom data to the client-side
		const {
			_id,
			basePrice,
			currentBid,
			bidIncrement,
			minimumBidAllowed,
			numOfBids,
			winningBuyer,
			endDate,
		} = auctionDetails;

		return {
			_id,
			basePrice,
			currentBid,
			bidIncrement,
			minimumBidAllowed,
			numOfBids,
			endDate,
			winningBuyer: {
				_id: winningBuyer?._id,
				name: winningBuyer?.name,
				email: winningBuyer?.email,
			},
		};
	}

	/**
	 * Get the winner for an auction
	 * @param auctionId - Auction id
	 */
	async getAuctionWinner(auctionId: string): Promise<any> {
		const auction = await this.auctionModel
			.findOne({
				_id: auctionId,
				status: AuctionStatus.Closed,
			})
			.populate('winningBuyer');

		if (!auction || !auction.winningBuyer) {
			return null;
		}

		const auctionWinner = auction.winningBuyer;

		return {
			_id: auctionWinner._id,
			name: auctionWinner.name,
			email: auctionWinner.email,
		};
	}

	/**
	 * Recover auction's assurance to all bidders
	 * @param auctionId
	 */
	async recoverAuctionAssurance(auctionId: string) {
		const auction = await this.auctionModel
			.findById(auctionId)
			.populate('bidders')
			.populate('winningBuyer');

		//* Filter bidders to remove winner
		let bidders = auction.bidders;

		//* Get assurance and recover to bidders wallet
		const assuranceValue = auction.chairCost;

		const winnerBuyer = auction.winningBuyer;

		for (const bidder of bidders) {
			//* Skip the winner
			if (bidder._id.toString() == winnerBuyer?._id.toString()) {
				this.logger.debug('Winner bidder, skipping...');
				return;
			}

			await this.walletService.recoverAssuranceToBidder(bidder, assuranceValue);
		}

		return true;
	}
	/*-------------------------*/
	/* Helper functions */

	/**
	 * Get the bid increment based on the current bid value from BiddingIncrementRules
	 * @param bidValue - Current bid value
	 * @returns calculated bid increment based on the current bid
	 */
	private calcBidIncrement(bidValue: number) {
		//* Calculate the new bid increment
		return this.biddingIncrementRules.calcBidIncrementBasedOnValue(bidValue);
	}

	/**
	 * Calculate the minimum bid allowed for that auction
	 * @param bidValue - Current bid amount
	 * @returns minimum bid allowed based on given bid value
	 */
	private calculateMinimumBidAllowed(bidValue: number, bidIncrement: number) {
		//* Calculate the new minimum bid by adding the current bid value with the calculated bid increment
		const newMinimumBid = bidValue + bidIncrement;

		return newMinimumBid;
	}

	/**
	 *Calculate the amount of money needed to join the auction
	 * @param basePrice : The opening price for the auction
	 * @returns
	 */
	private calculateChairCost(basePrice: number) {
		//* The chair cost will be 25% of the base price
		return basePrice * 0.25;
	}

	/*--------------------------*/
}
