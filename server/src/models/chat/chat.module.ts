import { ChatService } from './chat.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatController } from './chat.controller';
import { RoomMembersService } from './room-members.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		AuthModule,
	],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway, RoomMembersService],
})
export class ChatModule {}
