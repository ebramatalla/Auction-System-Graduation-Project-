import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { ImageType, ResponseResult } from 'src/common/types';
import { AuctionsService } from 'src/models/auction/auctions.service';
import { RejectAuctionDto } from 'src/models/auction/dto';
import { RejectExtendTimeDto } from 'src/models/auction/dto/reject-extend-time-auction.dto';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { DashboardAuctionsCount } from 'src/models/auction/types';
import { CategoryService } from 'src/models/category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/models/category/dto';
import { ComplaintService } from 'src/models/complaint/complaint.service';
import { Complaint } from 'src/models/complaint/schema/complaint.schema';
import { CloudinaryService } from 'src/providers/files-upload/cloudinary.service';
import { AuctionEmailsService } from 'src/providers/mail';
import { CreateEmployeeDto } from '../employee/dto';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeDocument } from '../employee/schema/employee.schema';
import { ChangePasswordDto, UserUpdateDto } from '../shared-user/dto';
import { FilterUsersQueryDto } from '../shared-user/dto/filter-users.dto';
import { User, UserDocument } from '../shared-user/schema/user.schema';
import { UsersService } from '../shared-user/users.service';
import {
	AdminFilterAuctionQueryDto,
	AdminFilterComplaintQueryDto,
} from './dto';
import { BlockUserReasonsEnum, EnumNames, WarningMessagesEnum } from './enums';
import { Admin, AdminDocument } from './schema/admin.schema';
import { AdminDashboardData } from './types/dashboard-data.type';

@Injectable()
export class AdminService {
	private logger: Logger = new Logger('admin');

	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<UserDocument>,
		private readonly usersService: UsersService,
		private readonly auctionService: AuctionsService,
		private readonly categoryService: CategoryService,
		private readonly employeeService: EmployeeService,
		private readonly complaintService: ComplaintService,
		private readonly auctionEmailsService: AuctionEmailsService,
		private cloudinary: CloudinaryService,
	) {}

	/* Profile */
	/**
	 * Edit admin/employee profile data
	 * @param userId
	 * @param updateUserDto
	 */
	async editProfile(
		userId: string,
		updateUserDto: UserUpdateDto,
	): Promise<ResponseResult> {
		//* Check if user upload new image to upload it to cloudinary
		let image: ImageType;
		let imageUpdated = false;
		if (updateUserDto.image) {
			imageUpdated = true;
			this.logger.debug('Uploading image to cloudinary...');

			try {
				// Upload image to cloudinary
				const savedImage = await this.cloudinary.uploadImage(
					updateUserDto.image,
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
			updateUserDto.image = image;
		}

		//* Find the user and update his data
		const user = await this.userModel.findById(userId);
		if (!user) {
			throw new BadRequestException('No user with that id ❌');
		}

		//? Remove old image if there was one
		if (imageUpdated && user.image?.publicId) {
			//* Remove the image by public id
			await this.cloudinary.destroyImage(user.image.publicId);
		}

		//* Update user data
		const updatesKeys = Object.keys(updateUserDto);
		updatesKeys.forEach(update => (user[update] = updateUserDto[update]));

		//* Save updated seller
		await user.save();

		return {
			success: true,
			message: 'User data updated successfully ✔✔',
		};
	}

	/**
	 * Change user password
	 * @param changePasswordDto
	 * @param userId
	 */
	async changePassword(
		{ oldPassword, newPassword }: ChangePasswordDto,
		userId: string,
	): Promise<ResponseResult> {
		//* Find the user and update his data
		const user = await this.userModel.findById(userId);

		if (!user) {
			throw new BadRequestException('No user with that id ❌');
		}

		//? Check if the password matches or not
		const isMatch = await compare(oldPassword, user.password);
		if (!isMatch) {
			return {
				success: false,
				message: 'Old password is incorrect ❌',
			};
		}

		//* Update user password
		user.password = newPassword;

		//* Save user seller
		await user.save();

		return {
			success: true,
			message: 'Password changed successfully ✔✔',
		};
	}

	/* Handle Dashboard Functions */

	/**
	 * @returns all auctions, categories and users count for dashboard
	 */
	async getDashboardData(): Promise<AdminDashboardData> {
		//* Get auctions count
		const {
			totalAuctions,
			pendingAuctionsCount,
			ongoingAuctionsCount,
			upcomingAuctionsCount,
			closedAuctionsCount,
			deniedAuctionsCount,
		}: DashboardAuctionsCount = await this.auctionService.getAuctionsCount();

		//* Get all categories count
		const totalCategories = await this.categoryService.getCategoriesCount();

		//* Get users count
		const {
			totalUsers,
			adminsCount,
			employeesCount,
			sellersCount,
			buyersCount,
		} = await this.usersService.getUsersCount();

		const { totalComplaints, notReadYetComplaints } =
			await this.complaintService.getComplaintsCount();

		return {
			auctions: {
				total: totalAuctions,
				pending: pendingAuctionsCount,
				ongoing: ongoingAuctionsCount,
				upcoming: upcomingAuctionsCount,
				closed: closedAuctionsCount,
				denied: deniedAuctionsCount,
			},
			categories: {
				total: totalCategories,
			},
			users: {
				total: totalUsers,
				admins: adminsCount,
				employees: employeesCount,
				sellers: sellersCount,
				buyers: buyersCount,
			},
			complaints: {
				total: totalComplaints,
				notReadYet: notReadYetComplaints,
			},
		};
	}

	/**
	 * @returns list of all winner's bidders
	 */
	async getWinnersBidders(): Promise<any[]> {
		return this.auctionService.getWinnersBiddersForDashboard();
	}

	/**
	 * @param top - How many auctions to return
	 * @returns List of top auctions
	 */
	async getTopAuctions(top?: number): Promise<Auction[]> {
		return this.auctionService.getTopAuctionsForDashboard(top);
	}
	/* Handle Users Functions */

	/**
	 * Find all users registered in the system
	 * @returns List of users
	 */
	findAllSystemUsers(filterUsersQueryDto: FilterUsersQueryDto) {
		return this.usersService.findAll(filterUsersQueryDto);
	}

	/**
	 * Return the enum values of given enum name
	 * @param enumName
	 * @returns
	 */
	getEnumValue(
		enumName: string,
	): BlockUserReasonsEnum[] | WarningMessagesEnum[] {
		if (enumName === EnumNames.BlockUserReasonsEnum) {
			return Object.values(BlockUserReasonsEnum);
		} else {
			return Object.values(WarningMessagesEnum);
		}
	}

	/**
	 * Warn a user and provide reason for warning
	 * @param userId : user id
	 * @param warningMessage: reason for warning
	 * @returns Promise<ResponseResult>
	 */
	async warnUser(
		userId: string,
		warningMessage: string,
	): Promise<ResponseResult> {
		const result = await this.usersService.toggleWarnUser(
			userId,
			warningMessage,
		);

		if (result.success && result?.data) {
			this.logger.debug('Sending warning email to user ...');
			// @ts-ignore
			const { user } = result?.data;

			//* Inform the user with email
			await this.auctionEmailsService.notifyUserAboutAction({
				user,
				warn: true,
				warningMessage,
			});

			delete result.data;
		}

		return result;
	}

	/**
	 * Remove warning badge from user
	 * @param userId : user id
	 */
	async removeWarnUser(userId: string): Promise<ResponseResult> {
		const result = await this.usersService.toggleWarnUser(userId);
		if (result.success && result?.data) {
			delete result.data;
		}

		return result;
	}

	/**
	 * Block a user and provide reason for blocking
	 * @param userId : user id
	 * @param blockReason : reason for blocking
	 * @returns Promise<ResponseResult>
	 */
	async blockUser(
		userId: string,
		blockReason: string,
	): Promise<ResponseResult> {
		const result = await this.usersService.toggleBlockUser(userId, blockReason);

		if (result.success && result?.data) {
			// @ts-ignore
			const { user } = result?.data;

			//* Inform the user with email
			await this.auctionEmailsService.notifyUserAboutAction({
				user,
				block: true,
				blockReason,
			});

			delete result.data;
		}

		return result;
	}

	/**
	 * Un-block a user
	 * @param userId - user id
	 */
	async unBlockUser(userId: string): Promise<ResponseResult> {
		const result = await this.usersService.toggleBlockUser(userId);
		if (result.success && result?.data) {
			delete result.data;
		}

		return result;
	}

	/* Handle Auctions Functions */

	/**
	 * List all auctions available
	 * @param filterAuctionQuery - Contains search criteria to search for specific auctions
	 */
	listAllAuctions(filterAuctionQuery: AdminFilterAuctionQueryDto) {
		return this.auctionService.findAll(filterAuctionQuery);
	}

	/**
	 * Approve auction by id
	 * @param auctionId
	 */
	async approveAuction(auctionId: string): Promise<ResponseResult> {
		const approvedAuction = await this.auctionService.approveAuction(auctionId);

		//? Return true if the auction approved successfully
		if (!approvedAuction)
			throw new BadRequestException('Cannot approve this auction right now!');

		//TODO: Send email to inform the seller

		return approvedAuction;
	}
	/**
	 * Get all the auctions that has time extension requests
	 * @returns List of all auctions that are needed to extend time
	 */
	async getTimeExtensionRequests(): Promise<any> {
		return this.auctionService.getAuctionsTimeExtensionRequests();
	}

	/**
	 *
	 * @param auctionId - auction id
	 * @returns if auction is extended successfully or not
	 */
	async approveExtendAuction(auctionId: string): Promise<ResponseResult> {
		const responseResult: ResponseResult =
			await this.auctionService.approveTimeExtensionRequest(auctionId);

		//TODO: Send email to inform the seller that auction time increased

		//TODO: Send email to inform the bidders that auction time increased

		return responseResult;
	}

	/**
	 * Reject time extension request
	 * @param auctionId
	 * @param rejectExtendTomeDto
	 * @returns if auction is rejected successfully or not
	 */
	async rejectExtendAuction(
		auctionId: string,
		rejectExtendTomeDto: RejectExtendTimeDto,
	): Promise<ResponseResult> {
		const responseResult: ResponseResult =
			await this.auctionService.rejectTimeExtensionRequest(
				auctionId,
				rejectExtendTomeDto,
			);

		//TODO: Send email to inform the seller that auction time request rejected

		return responseResult;
	}

	/**
	 * Reject specific auction by id
	 * @param auctionId
	 * @param rejectAuctionDto - Rejection Reason
	 * @returns Updated auction
	 */
	async rejectAuction(
		auctionId: string,
		rejectAuctionDto: RejectAuctionDto,
	): Promise<ResponseResult> {
		const rejectedAuction = await this.auctionService.rejectAuction(
			auctionId,
			rejectAuctionDto,
		);

		//? Return true if the auction approved successfully
		if (!rejectedAuction)
			throw new BadRequestException('Cannot reject this auction right now!');

		//TODO: Send email to inform the seller

		return {
			success: true,
			message: 'Auction rejected successfully 🤙🏻',
		};
	}

	/* Handle Employee Functions */

	/**
	 * Add new employee
	 * @param createEmployeeDto Emp data
	 * @returns employee instance
	 */
	addEmployee(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDocument> {
		return this.employeeService.create(createEmployeeDto);
	}

	/**
	 * List all employees
	 */
	listEmployee(): Promise<EmployeeDocument[]> {
		return this.employeeService.listAll();
	}

	/**
	 * Remove employee with id
	 * @param id Employee id
	 * @returns Deleted employee document
	 */
	removeEmployee(id: string): Promise<EmployeeDocument> {
		return this.employeeService.remove(id);
	}

	/* Handle Category Functions */
	/**
	 * Creates new category
	 * @param body - category's data
	 * @returns  instance of the created category
	 */
	createCategory(body: CreateCategoryDto) {
		return this.categoryService.create(body);
	}

	/**
	 * List all categories found or filter by name
	 * @param name - Optional category name
	 * @returns Array of all categories
	 */
	listAllCategories(name?: string) {
		return this.categoryService.listAll(name);
	}

	/**
	 * Find one category by id
	 * @param id category id
	 * @returns Matched category if found
	 */
	findOneCategory(id: string) {
		return this.categoryService.findOne(id);
	}

	/**
	 * Updates category
	 * @param id category id
	 * @param updateCategoryDto new data
	 * @returns  instance of the updated category
	 */
	updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
		return this.categoryService.update(id, updateCategoryDto);
	}

	/**
	 * Removes category
	 * @param id
	 * @returns instance of the category
	 */
	removeCategory(id: string) {
		return this.categoryService.remove(id);
	}

	/*------------------------------------------*/
	/* Handle Complaints Functions */

	/**
	 * List all submitted complaints
	 * @returns array of complaints
	 */
	listAllComplaint(
		adminFilterComplaintQueryDto?: AdminFilterComplaintQueryDto,
	): Promise<Complaint[]> {
		return this.complaintService.findAll(adminFilterComplaintQueryDto);
	}

	/**
	 * List all submitted complaints in system
	 * @returns array of complaints
	 */
	listAllComplaintInSystem(): Promise<Complaint[]> {
		return this.complaintService.findAllSystemComplaints();
	}

	/**
	 * Mark a complaint as read
	 * @param complaintId
	 * @returns true or false
	 */
	markComplaintRead(complaintId: String): Promise<ResponseResult> {
		return this.complaintService.markComplaintAsRead(complaintId);
	}

	/**
	 * Delete complaint by id
	 * @param complaintId
	 * @returns
	 */
	deleteComplaint(complaintId: String) {
		return this.complaintService.deleteComplaint(complaintId);
	}
}
