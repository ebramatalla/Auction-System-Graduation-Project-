import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HandleDateService } from 'src/common/utils';
import { Message } from '../dto';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
	@Prop({ required: [true, 'Message is required'] })
	messages: [Message];

	@Prop({ required: [true, 'user1 is required'] })
	user1: string;

	@Prop({ required: [true, 'user2 is required'] })
	user2: string;

	@Prop({ default: new Date() })
	createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
