import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
	GetCurrentUserData,
	Roles,
	IsPublicRoute,
} from 'src/common/decorators';
import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { Serialize } from 'src/common/interceptors';
import { Role } from '../users/shared-user/enums';
import { ComplaintService } from './complaint.service';
import {
	ComplaintDto,
	CreateComplaintDto,
	CreateComplaintInSystemDto,
} from './dto';
import { Complaint } from './schema/complaint.schema';
import { ResponseResult } from 'src/common/types';

@ApiTags('Complaint')
@Controller('Complaint')
export class ComplaintController {
	constructor(private readonly complaintService: ComplaintService) {}

	@Roles(Role.Seller, Role.Buyer)
	@Serialize(ComplaintDto)
	@Post('submit')
	submitNewComplaint(
		@Body() createComplaintDto: CreateComplaintDto,
		@GetCurrentUserData('_id') userId: string,
	): Promise<Complaint> {
		return this.complaintService.create(createComplaintDto, userId);
	}

	@IsPublicRoute()
	@Post('submit-on-system')
	submitComplaintOnSystem(
		@Body() createComplaintInSystemDto: CreateComplaintInSystemDto,
	): Promise<ResponseResult> {
		return this.complaintService.createComplaintInSystem(
			createComplaintInSystemDto,
		);
	}

	@Roles(Role.Seller, Role.Buyer)
	@Serialize(ComplaintDto)
	@Get('submitted')
	listMyComplaint(@GetCurrentUserData('_id') userId: string) {
		return this.complaintService.listUserComplaint(userId);
	}

	@Roles(Role.Seller, Role.Buyer)
	@Serialize(ComplaintDto)
	@Delete(':id')
	deleteComplaint(@Param() { id }: MongoObjectIdDto) {
		return this.complaintService.deleteComplaint(id);
	}
}
