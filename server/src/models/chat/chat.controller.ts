import { Controller, Get, Param } from '@nestjs/common';
import { GetCurrentUserData, Roles } from 'src/common/decorators';
import { Role } from '../users/shared-user/enums';
import { UserDocument } from '../users/shared-user/schema/user.schema';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	@Get()
	@Roles(Role.Seller, Role.Buyer, Role.Employee)
	myChats(@GetCurrentUserData() user: UserDocument) {
		//if user is employee make email = support
		if (user.role == Role.Employee) {
			const chats = this.chatService.getMyChat('Support@email.com');
			return chats;
		} else {
			const chats = this.chatService.getMyChat(user.email);
			return chats;
		}
	}

	@Get('/:user2')
	@Roles(Role.Seller, Role.Buyer, Role.Employee)
	async FindPrivateChat(
		@Param('user2') user2: string,
		@GetCurrentUserData() user: UserDocument,
	) {
		if (user.role == 'employee') {
			//if user is employee make email = support
			return this.chatService.findPrivateChat('Support@email.com', user2);
		} else {
			return this.chatService.findPrivateChat(user.email, user2);
		}
	}
}
