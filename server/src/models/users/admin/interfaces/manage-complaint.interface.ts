import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { ResponseResult } from 'src/common/types';
import {
	Complaint,
	ComplaintDocument,
} from 'src/models/complaint/schema/complaint.schema';
import { AdminFilterComplaintQueryDto } from '../dto';

export interface AdminComplaintsBehavior {
	//* List all Complaint for the admin
	listAllComplaint(
		adminFilterComplaintQueryDto: AdminFilterComplaintQueryDto,
	): Promise<Complaint[]>;

	//* List all Complaint in system for the admin
	listAllComplaintInSystem(): Promise<Complaint[]>;

	//* Mark an complaint as read
	markAsRead(complaintId: MongoObjectIdDto): Promise<ResponseResult>;

	//* Delete single complaint
	deleteComplaint(complaintId: MongoObjectIdDto): Promise<Complaint>;
}
