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
import { GetCurrentUserData, Roles } from 'src/common/decorators';
import { AdminService } from './admin.service';
import { Role } from 'src/models/users/shared-user/enums';
import {
	CategoryDto,
	CreateCategoryDto,
	UpdateCategoryDto,
} from 'src/models/category/dto';
import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { Serialize } from 'src/common/interceptors';
import {
	AdminAuctionsBehavior,
	AdminCategoryBehaviors,
	AdminEmployeeBehaviors,
	AdminUsersBehaviors,
} from './interfaces';
import { CreateEmployeeDto } from '../employee/dto';
import { EmployeeDocument } from '../employee/schema/employee.schema';
import { EmployeeDto } from '../employee/dto/employee.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { AuctionDto, RejectAuctionDto } from 'src/models/auction/dto';
import { ChangePasswordDto, UserDto, UserUpdateDto } from '../shared-user/dto';
import { User } from '../shared-user/schema/user.schema';
import { FilterUsersQueryDto } from '../shared-user/dto/filter-users.dto';
import { AdminComplaintsBehavior } from './interfaces/manage-complaint.interface';
import {
	AdminBlockUserDto,
	AdminFilterAuctionQueryDto,
	AdminFilterComplaintQueryDto,
	AdminWarnUserDto,
	GetEnumValues,
	GetTopAuctionsDto,
} from './dto';
import { AdminDashboardBehavior } from './interfaces/manage-dashboard.interface';
import { AdminDashboardData } from './types/dashboard-data.type';
import { ComplaintDto } from 'src/models/complaint/dto';
import { Complaint } from 'src/models/complaint/schema/complaint.schema';
import { ResponseResult } from 'src/common/types';
import { WarningMessagesEnum, BlockUserReasonsEnum } from './enums';
import { RejectExtendTimeDto } from 'src/models/auction/dto/reject-extend-time-auction.dto';
import { FormDataRequest } from 'nestjs-form-data';

@ApiTags('Admin')
@Roles(Role.Admin, Role.Employee)
@Controller('admin')
export class AdminController
	implements
		AdminDashboardBehavior,
		AdminUsersBehaviors,
		AdminAuctionsBehavior,
		AdminEmployeeBehaviors,
		AdminCategoryBehaviors,
		AdminComplaintsBehavior
{
	constructor(private readonly adminService: AdminService) {}

	/* Profile Behaviors */
	@Patch('profile')
	@FormDataRequest() // Comes from NestjsFormDataModule (Used to upload files)
	editProfile(
		@Body() userUpdateDto: UserUpdateDto,
		@GetCurrentUserData('_id') userId: string,
	): Promise<ResponseResult> {
		return this.adminService.editProfile(userId, userUpdateDto);
	}

	@Patch('profile/change-password')
	changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@GetCurrentUserData('_id') userId: string,
	): Promise<ResponseResult> {
		return this.adminService.changePassword(changePasswordDto, userId);
	}

	/* Handle Dashboard Behaviors */
	@Get('dashboard')
	listDashboardData(): Promise<AdminDashboardData> {
		return this.adminService.getDashboardData();
	}

	@Get('dashboard/winners')
	listAllWinnersBidders(): Promise<any[]> {
		return this.adminService.getWinnersBidders();
	}

	@Get('dashboard/auctions')
	getTopAuctions(@Query() { top }: GetTopAuctionsDto): Promise<Auction[]> {
		return this.adminService.getTopAuctions(top);
	}

	/* Handle Users Behaviors */
	/**
	 * List all system users
	 * @returns List of all users
	 */
	@Serialize(UserDto)
	@Get('users')
	findAllSystemUsers(
		@Query() filterUsersQueryDto: FilterUsersQueryDto,
	): Promise<User[]> {
		return this.adminService.findAllSystemUsers(filterUsersQueryDto);
	}

	@Get('get-enum-values')
	getEnumValue(
		@Query() { enumName }: GetEnumValues,
	): WarningMessagesEnum[] | BlockUserReasonsEnum[] {
		return this.adminService.getEnumValue(enumName);
	}

	@Post('users/warn')
	@HttpCode(HttpStatus.OK)
	warnUser(
		@Query() { id: userId }: MongoObjectIdDto,
		@Body() { warningMessage }: AdminWarnUserDto,
	): Promise<ResponseResult> {
		return this.adminService.warnUser(userId, warningMessage);
	}

	@Post('users/remove-warn')
	@HttpCode(HttpStatus.OK)
	removeWarn(
		@Query() { id: userId }: MongoObjectIdDto,
	): Promise<ResponseResult> {
		return this.adminService.removeWarnUser(userId);
	}

	@Post('users/block')
	@HttpCode(HttpStatus.OK)
	blockUser(
		@Query() { id: userId }: MongoObjectIdDto,
		@Body() { blockReason }: AdminBlockUserDto,
	): Promise<ResponseResult> {
		return this.adminService.blockUser(userId, blockReason);
	}

	@Post('users/unblock')
	@HttpCode(HttpStatus.OK)
	unBlockUser(
		@Query() { id: userId }: MongoObjectIdDto,
	): Promise<ResponseResult> {
		return this.adminService.unBlockUser(userId);
	}

	/* Handle Auction Behaviors */
	/**
	 * List all available auctions
	 */
	@Serialize(AuctionDto)
	@Get('auction')
	listAllAuctions(
		@Query() filterAuctionQuery: AdminFilterAuctionQueryDto,
	): Promise<Auction[]> {
		return this.adminService.listAllAuctions(filterAuctionQuery);
	}

	@Post('auction/approve/:id')
	@HttpCode(HttpStatus.OK)
	approveAuction(
		@Param() { id: auctionId }: MongoObjectIdDto,
	): Promise<ResponseResult> {
		return this.adminService.approveAuction(auctionId);
	}

	@Post('auction/reject/:id')
	@HttpCode(HttpStatus.OK)
	rejectAuction(
		@Param() { id: auctionId }: MongoObjectIdDto,
		@Body() rejectAuctionDto: RejectAuctionDto,
	): Promise<ResponseResult> {
		return this.adminService.rejectAuction(auctionId, rejectAuctionDto);
	}

	/**
	 *
	 * @returns List of all list of all auctions that need to be extended
	 */
	@Get('auction/extended-auction')
	listAllTimeExtensionRequests(): Promise<any> {
		return this.adminService.getTimeExtensionRequests();
	}

	/**
	 *
	 * @param param0 id of the auction
	 * @returns auction that is approved
	 */
	@Post('auction/approve-extend/:id')
	@HttpCode(HttpStatus.OK)
	approveExtendAuction(
		@Param() { id: auctionId }: MongoObjectIdDto,
	): Promise<ResponseResult> {
		return this.adminService.approveExtendAuction(auctionId);
	}

	/**
	 * Reject extension time request for an auction
	 * @param Auction id
	 * @param rejectExtendAuctionDto
	 * @returns ResponseResult
	 */
	@Post('auction/reject-extend/:id')
	@HttpCode(HttpStatus.OK)
	rejectExtendAuction(
		@Param() { id: auctionId }: MongoObjectIdDto,
		@Body() rejectExtendAuctionDto: RejectExtendTimeDto,
	): Promise<ResponseResult> {
		return this.adminService.rejectExtendAuction(
			auctionId,
			rejectExtendAuctionDto,
		);
	}

	/* Handle Employee Behaviors */

	/**
	 * Add new employee
	 * @param createEmployeeDto
	 * @returns employee document
	 */
	@Serialize(EmployeeDto)
	@Post('employee')
	addEmployee(
		@Body() createEmployeeDto: CreateEmployeeDto,
	): Promise<EmployeeDocument> {
		return this.adminService.addEmployee(createEmployeeDto);
	}

	/**
	 * List all employees
	 * @returns employee list
	 */
	@Serialize(EmployeeDto)
	@Get('employee')
	listEmployees(): Promise<EmployeeDocument[]> {
		return this.adminService.listEmployee();
	}

	/**
	 * Remove employee by id
	 * @param id: employee id
	 * @returns employee document
	 */
	@Serialize(EmployeeDto)
	@Delete('employee/:id')
	removeEmployee(@Param() { id }: MongoObjectIdDto): Promise<EmployeeDocument> {
		return this.adminService.removeEmployee(id);
	}

	/* Handle Category Functions */
	/**
	 * Create a new category
	 * @param body : CreateCategoryDto
	 * @returns created category instance
	 */
	@Serialize(CategoryDto)
	@Post('category')
	addCategory(@Body() body: CreateCategoryDto) {
		return this.adminService.createCategory(body);
	}

	/**
	 * Get single category by id
	 * @param param category id
	 * @returns category instance if found, NotFoundException thrown otherwise.
	 */
	@Serialize(CategoryDto)
	@Get('category/:id')
	getCategory(@Param() { id }: MongoObjectIdDto) {
		return this.adminService.findOneCategory(id);
	}

	/**
	 * list all available categories
	 * @returns Array of all categories
	 */
	@Serialize(CategoryDto)
	@Get('category')
	showAllCategories(@Query('name') name: string) {
		return this.adminService.listAllCategories(name);
	}

	/**
	 * Update existing category by id
	 * @param id : category id
	 * @param updateCategoryDto : New category data
	 */
	@Serialize(CategoryDto)
	@Patch('category/:id')
	updateCategory(
		@Param() { id }: MongoObjectIdDto,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.adminService.updateCategory(id, updateCategoryDto);
	}

	/**
	 * Remove a category by id
	 * @param param category id
	 */
	@Serialize(CategoryDto)
	@Delete('category/:id')
	deleteCategory(@Param() { id }: MongoObjectIdDto) {
		return this.adminService.removeCategory(id);
	}

	/*----------------------------*/
	/* Handle Category Functions */

	@Serialize(ComplaintDto)
	@Get('complaints')
	listAllComplaint(
		@Query() adminFilterComplaintQueryDto: AdminFilterComplaintQueryDto,
	): Promise<Complaint[]> {
		return this.adminService.listAllComplaint(adminFilterComplaintQueryDto);
	}

	@Serialize(ComplaintDto)
	@Get('complaints-in-system')
	listAllComplaintInSystem(): Promise<Complaint[]> {
		return this.adminService.listAllComplaintInSystem();
	}

	@Patch('complaints/:id')
	markAsRead(@Param() { id }: MongoObjectIdDto): Promise<ResponseResult> {
		return this.adminService.markComplaintRead(id);
	}

	@Delete('complaints/:id')
	deleteComplaint(@Param() { id }: MongoObjectIdDto): Promise<Complaint> {
		return this.adminService.deleteComplaint(id);
	}
}
