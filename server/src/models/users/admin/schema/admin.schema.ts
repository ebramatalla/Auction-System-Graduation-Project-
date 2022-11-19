import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../shared-user/schema/user.schema';

export type AdminDocument = Admin & Document;

/**
 * This schema contains only properties that is specific to the Admin,
 *  as the rest of properties will be inherited from the shared-user
 */

@Schema()
export class Admin extends User {}

export const AdminSchema = SchemaFactory.createForClass(Admin);
