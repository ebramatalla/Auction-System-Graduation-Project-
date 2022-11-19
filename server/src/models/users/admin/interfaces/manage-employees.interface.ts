import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { CreateEmployeeDto } from '../../employee/dto';
import { EmployeeDocument } from '../../employee/schema/employee.schema';

/*
 ? This interface include all functions related to the employee
 */

export interface AdminEmployeeBehaviors {
	addEmployee(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDocument>;
	listEmployees(): Promise<EmployeeDocument[]>;
	removeEmployee(id: MongoObjectIdDto): Promise<EmployeeDocument>;
}
