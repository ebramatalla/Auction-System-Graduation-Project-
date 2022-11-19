import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schema/employee.schema';
import { CreateEmployeeDto } from './dto/';
import { Roles } from 'src/common/decorators';
import { Role } from '../shared-user/enums';

@Injectable()
export class EmployeeService {
	constructor(
		@InjectModel(Employee.name)
		private readonly employeeModel: Model<EmployeeDocument>,
	) {}

	/**
	 * Create new employee instance
	 * @param createEmployeeDto: createEmployeeDto
	 */
	async create(createEmployeeDto: CreateEmployeeDto) {
		//? Ensure that there is no employee with the same name already exists.
		const isAlreadyExists = await this.employeeModel.findOne({
			email: createEmployeeDto.email,
		});
		if (isAlreadyExists)
			throw new BadRequestException(
				'Employee with the same email already exists❌.',
			);

		const createdEmployee: EmployeeDocument = new this.employeeModel({
			...createEmployeeDto,
			role: Role.Employee,
		});

		await createdEmployee.save();

		return createdEmployee;
	}

	/**
	 * List al employees found
	 * @returns List of all employees
	 */
	async listAll() {
		return this.employeeModel.find();
	}

	/**
	 * Remove employee
	 * @param id: string
	 */
	async remove(id: string) {
		const employee = await this.employeeModel.findByIdAndRemove(id);

		if (!employee) throw new NotFoundException('Employee not found ❌');

		return employee;
	}
}
