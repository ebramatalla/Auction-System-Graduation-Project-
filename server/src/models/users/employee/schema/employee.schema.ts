import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../shared-user/schema/user.schema';

export type EmployeeDocument = Employee & Document;

/**
 * This schema contains only properties that is specific to the Employee,
 *  as the rest of properties will be inherited from the shared-user
 */

@Schema()
export class Employee extends User {}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
