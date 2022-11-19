import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ComplaintDocument, Complaint } from './schema/complaint.schema';
import { CreateComplaintDto, CreateComplaintInSystemDto } from './dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AdminFilterComplaintQueryDto } from '../users/admin/dto';
import { ResponseResult } from 'src/common/types';

@Injectable()
export class ComplaintService {
	private logger: Logger = new Logger(ComplaintService.name);

	constructor(
		@InjectModel(Complaint.name)
		private readonly complaintModel: Model<ComplaintDocument>,
	) {}

	/**
	 * Create new complaint
	 * @param createComplaintDto
	 * @param from
	 * @returns created complaint
	 */
	async create(
		createComplaintDto: CreateComplaintDto,
		from: string,
	): Promise<Complaint> {
		const createdComplaint: ComplaintDocument = new this.complaintModel({
			reason: createComplaintDto.reason,
			in: createComplaintDto.in,
			from,
		});

		if (!createdComplaint) {
			throw new BadRequestException(
				'Complaint cannot be submitted right now 😑',
			);
		}

		await createdComplaint.save();

		this.logger.log(
			`New complaint recieved from ${createdComplaint.from} in ${createdComplaint.in}.`,
		);

		await createdComplaint.populate(['from', 'in']);

		return createdComplaint;
	}

	/**
	 * Accept complaint from user in system
	 * @param createComplaintInSystemDto
	 * @returns ResponseResult
	 */
	async createComplaintInSystem(
		createComplaintInSystemDto: CreateComplaintInSystemDto,
	): Promise<ResponseResult> {
		const createdComplaint: ComplaintDocument = new this.complaintModel({
			reason: createComplaintInSystemDto.reason,
			from: createComplaintInSystemDto.from,
			in: 'system',
			inSystem: true,
		});

		if (!createdComplaint) {
			throw new BadRequestException(
				'Complaint cannot be submitted right now 😑',
			);
		}

		await createdComplaint.save();

		this.logger.log(
			`New complaint recieved from ${createdComplaint.from} in SYSTEM.`,
		);

		return {
			success: true,
			message: 'Complaint created successfully 🤘🏻',
		};
	}

	/**
	 * List all complaints from db, sorted by date
	 * @returns all complaint
	 */
	async findAll(
		adminFilterComplaintQueryDto?: AdminFilterComplaintQueryDto,
	): Promise<Complaint[]> {
		let complaints: Complaint[] = await this.complaintModel
			.find({ ...adminFilterComplaintQueryDto, inSystem: false })
			.populate(['from', 'in'])
			.sort({
				createdAt: 1,
			});

		this.logger.debug('Retrieving all submitted complaints...');

		return complaints;
	}

	/**
	 * List all complaints that in system
	 * @returns all complaint
	 */
	async findAllSystemComplaints(): Promise<Complaint[]> {
		let complaints: Complaint[] = await this.complaintModel
			.find({
				inSystem: true,
			})
			.sort({
				createdAt: 1,
			});

		this.logger.debug('Retrieving all submitted complaints in system...');

		return complaints;
	}

	/**
	 * Mark complaint as read by admin
	 * @param complaintId
	 * @returns true or false
	 */
	async markComplaintAsRead(complaintId: String): Promise<ResponseResult> {
		//* Set markedAsRead field to true
		const updatedComplaint = await this.complaintModel.findByIdAndUpdate(
			complaintId,
			{
				markedAsRead: true,
			},
			{
				new: true,
			},
		);

		if (!updatedComplaint) {
			throw new BadRequestException(
				'Cannot update this complaint right now 😑',
			);
		}

		this.logger.log('New complaint marked as read by admin ✔✔');

		return { success: true };
	}

	/**
	 *
	 * @param id
	 * @returns deleted complaint
	 */
	async deleteComplaint(id: String): Promise<Complaint> {
		const deletedComplaint = await this.complaintModel.findByIdAndDelete(id);
		if (!deletedComplaint) {
			throw new BadRequestException('Complaint not found ❌');
		}

		this.logger.warn('Complaint deleted successfully 🤘🏻');

		return deletedComplaint;
	}

	/**
	 * Get list of complaints for specific user
	 * @param from - User id that submit complaints in another one
	 * @return all complaint of this user
	 */
	async listUserComplaint(from: string): Promise<Complaint[]> {
		this.logger.debug(`Retrieving complaints related to ${from}`);

		const complaints: Complaint[] = await this.complaintModel
			.find({ from })
			.populate(['from', 'in'])
			.sort({ createdAt: -1 });

		return complaints;
	}

	/**
	 * Get complaints count for admin dashboard
	 */
	async getComplaintsCount(): Promise<{
		totalComplaints: any;
		notReadYetComplaints: any;
	}> {
		//* Get all complaints
		const complaints = await this.complaintModel.find();

		//* Get the length
		const totalComplaints = complaints.length;

		//* Get not read complaints count
		const notReadYetComplaints = complaints.filter(
			complaint => complaint.markedAsRead === false,
		).length;

		return {
			totalComplaints,
			notReadYetComplaints,
		};
	}
}
