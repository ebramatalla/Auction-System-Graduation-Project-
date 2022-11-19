import { HandleDateService } from 'src/common/utils';

export class Message {
	constructor(message: string, user1IsSender: string) {
		this.message = message;
		this.senderEmail = user1IsSender;

		// Get the current date from moment js
		this.sentAt = new Date();
	}

	message: string;

	sentAt: Date;

	senderEmail: string;
}
