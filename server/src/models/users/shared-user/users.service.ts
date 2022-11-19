import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseResult } from 'src/common/types';
import { CategoryService } from 'src/models/category/category.service';
import { FilterUsersQueryDto } from './dto/filter-users.dto';
import { Role } from './enums';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
	) {}

	/**
	 * Find all users
	 * @returns List of all existing users
	 */
	async findAll(filterUsersQueryDto?: FilterUsersQueryDto): Promise<User[]> {
		const users = await this.usersModel.find(filterUsersQueryDto);
		return users;
	}

	/**
	 * Find user by id
	 * @param _id
	 * @returns User instance if found, NotFoundException thrown otherwise.
	 */
	async findById(_id: string) {
		const user = await this.usersModel.findById(_id).exec();
		if (!user) throw new NotFoundException('User not found ❌');
		return user;
	}

	/**
	 * Find user by email
	 * @param email
	 * @returns User instance if found, NotFoundException thrown otherwise.
	 */
	async findByEmail(email: string) {
		const user = await this.usersModel.findOne({ email }).exec();
		// if (!user) throw new NotFoundException('User not found ❌');
		return user;
	}

	async findByName(name: string) {
		const user = await this.usersModel.findOne({ name }).exec();
		if (user) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Save user verification code in user document
	 * @param email - user email
	 * @param verificationCode - generated verification code
	 */
	async handleNewVerificationCode(email: string, verificationCode: number) {
		await this.usersModel.findOneAndUpdate(
			{ email },
			{
				emailVerificationCode: verificationCode,
			},
		);
	}

	/**
	 * Set the isEmailConfirmed to true
	 * @param email
	 */
	async markEmailAsConfirmed(email: string) {
		const user = await this.usersModel.findOneAndUpdate(
			{ email },
			{ isEmailConfirmed: true },
			{ new: true },
		);

		return user;
	}

	/**
	 * Set the isPhoneNumberConfirmed to true
	 * @param email
	 */
	async markPhoneNumberAsConfirmed(userId: string) {
		const user = await this.usersModel.findByIdAndUpdate(
			userId,
			{ isPhoneNumberConfirmed: true },
			{ new: true },
		);

		if (!user) {
			throw new BadRequestException('User not found ❌');
		}

		return true;
	}

	/**
	 * Reset user password
	 * @param email - user email
	 * @param verificationCode - generated verification code
	 * @param newPassword - new password
	 * @returns boolean
	 */
	async resetUserPassword(
		email: string,
		verificationCode: number,
		newPassword: string,
	): Promise<boolean> {
		//* Find the user by email and update password
		const user = await this.usersModel.findOne({
			email,
			emailVerificationCode: verificationCode,
		});

		if (!user) {
			return false;
		}

		user.password = newPassword;

		await user.save();

		return true;
	}

	/**
	 * Get users count to be displayed in admin dashboard
	 */
	async getUsersCount(): Promise<{
		totalUsers: number;
		adminsCount: number;
		employeesCount: number;
		sellersCount: number;
		buyersCount: number;
	}> {
		//* Get the users documents
		const users = await this.usersModel.find();

		//* Get the users count
		const totalUsers = users.length;

		//* Get the admins count
		const adminsCount = users.filter(user => user.role === Role.Admin).length;

		//* Get the employees count
		const employeesCount = users.filter(
			user => user.role === Role.Employee,
		).length;

		//* Get the sellers count
		const sellersCount = users.filter(user => user.role === Role.Seller).length;

		//* Get the buyers count
		const buyersCount = users.filter(user => user.role === Role.Buyer).length;

		return {
			totalUsers,
			adminsCount,
			employeesCount,
			sellersCount,
			buyersCount,
		};
	}

	/**
	 * Block or un-block user by id
	 * @param userId
	 * @param blockReason? if not provided, user will be un-blocked
	 */
	async toggleBlockUser(
		userId: string,
		blockReason?: string,
	): Promise<ResponseResult> {
		//* Set the variable as blocked user (default)
		let isBlocked: boolean = true;
		let message: string = 'User blocked successfully ✅';

		//* Check if the blockReason is provided, if not so it is unblock operation
		if (!blockReason) {
			isBlocked = false;
			blockReason = null;
			message = 'User unblocked successfully ✅';
		}

		//* Block/Un-block user by update isBlock field to true/false and blockReason to blockReason
		const user = await this.usersModel.findByIdAndUpdate(
			userId,
			{
				isBlocked,
				blockReason,
			},
			{ new: true },
		);

		if (!user) {
			throw new BadRequestException('User not found ❌');
		}

		return {
			success: true,
			message,
			data: {
				user,
			},
		};
	}

	/**
	 * Add/remove warn badge from user
	 * @param userId
	 * @param warningMessage
	 */
	async toggleWarnUser(
		userId: string,
		warningMessage?: string,
	): Promise<ResponseResult> {
		//* Set the variable as waned user (default)
		let isWarned: boolean = true;
		let message: string = 'Warning badge added to user 👍🏻';

		//* Check if the warningMessage is provided, if not, so it is remove warn operation
		if (!warningMessage) {
			isWarned = false;
			warningMessage = null;
			message = 'Warning badge removed from user 👍🏻';
		}

		//* Warn/remove-warn from user by update isWarned field to true/false and warningMessage to warningMessage
		const user = await this.usersModel.findByIdAndUpdate(
			userId,
			{
				isWarned: isWarned,
				warningMessage,
			},
			{ new: true },
		);

		if (!user) {
			throw new BadRequestException('User not found ❌');
		}

		return {
			success: true,
			message,
			data: {
				user,
			},
		};
	}
}
