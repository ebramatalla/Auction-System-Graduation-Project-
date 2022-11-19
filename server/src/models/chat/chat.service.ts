import { Injectable, Logger, UseGuards } from '@nestjs/common';
import { Chat, ChatDocument } from './schema/chat.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './dto';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/shared-user/schema/user.schema';

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(Chat.name)
		private readonly chatModel: Model<ChatDocument>,
		private readonly authService: AuthService,
	) {}
	private logger: Logger = new Logger('chatservice');

	/**
	 * Accept the socket client and return the user
	 * @param client
	 * @return user if found
	 */
	async getConnectedClientUserObject(client: Socket): Promise<User | null> {
		//* Get the access token from client
		const accessToken = await this.authService.getJWTTokenFromSocketClient(
			client,
		);

		//? If no access token found
		if (!accessToken) {
			return null;
		}

		//* Get the user
		const user = await this.authService.getUserFromJWT(accessToken); //* The user may be null (expired token)

		return user;
	}

	/**
	 * Create new chat between 2 users
	 * @param clientEmail
	 * @param receiverEmail
	 * @param message
	 */
	async createNewChat(
		clientEmail: string,
		receiverEmail: string,
		message: string,
	): Promise<ChatDocument> {
		//* Create new chat
		const createdChat: ChatDocument = new this.chatModel({
			user1: clientEmail,
			user2: receiverEmail,
			message,
		});

		if (!createdChat) {
			throw new Error('Failed to create chat');
		}
		// Save the created chat
		await createdChat.save();

		return createdChat;
	}

	/**
	 * @returns Chat history between client and receiver
	 */
	async getAllClientChatHistory(
		clientEmail: string,
		receiverEmail: string,
	): Promise<any> {
		// Find the chat document
		const chat = await this.findPrivateChat(clientEmail, receiverEmail);
		if (chat) {
			// Return the messages array only
			return chat.messages;
		}
	}
	async getMyChat(clientEmail: string): Promise<any> {
		// Find the all chat document
		const chat = await this.findChats(clientEmail);
		if (chat) {
			return chat;
		}
	}

	/**
	 * Handle the new incoming message by saving it
	 * @param clientEmail
	 * @param receiverEmail
	 * @param messageString
	 */
	async handleNewMessage(
		clientEmail: string,
		receiverEmail: string,
		messageString: string,
	): Promise<Message> {
		//* Find the chat between the client and the given receiver
		let chat = await this.findPrivateChat(clientEmail, receiverEmail);

		//? If the chat is not found, create new one
		if (!chat) {
			chat = await this.createNewChat(
				clientEmail,
				receiverEmail,
				messageString,
			);
		}

		//* Create new message object
		const message = new Message(messageString, clientEmail);

		//* Update chat messages
		this.updateChatMessages(chat, message);

		return message;
	}
	async handleNewMessageToSupport(
		sender: string,
		receiverEmail: string,
		messageString: string,
	): Promise<Message> {
		const supportEmail = 'Support@email.com';

		//* Find the chat between the client and the  Support
		let chat = await this.findPrivateChat(sender, receiverEmail);
		if (chat) {
		}
		//? If the chat is not found, create new one
		if (!chat) {
			chat = await this.createNewChat(sender, supportEmail, messageString);
		}

		//* Create new message object
		const message = new Message(messageString, sender);

		//* Update chat messages
		this.updateChatMessages(chat, message);

		return message;
	}
	async handleNewMessageFromSupport(
		sender: string,
		receiverEmail: string,
		messageString: string,
	): Promise<Message> {
		const supportEmail = 'Support@email.com';

		//* Find the chat between the client and the  Support
		let chat = await this.findPrivateChat(supportEmail, receiverEmail);
		if (chat) {
		}
		//? If the chat is not found, create new one
		if (!chat) {
			chat = await this.createNewChat(sender, supportEmail, messageString);
		}

		//* Create new message object
		const message = new Message(messageString, sender);

		//* Update chat messages
		this.updateChatMessages(chat, message);

		return message;
	}

	async findChats(name: string) {
		const chat = await this.chatModel
			.find({
				$or: [{ user1: name }, { user2: name }],
			})
			.sort({ createdAt: -1 });
		return chat;
	}

	/**
	 * Get the chat between the 2 users
	 * @param user1Email
	 * @param user2Email
	 * @returns Chat if exists
	 */
	async findPrivateChat(
		user1Email: string,
		user2Email: string,
	): Promise<ChatDocument | null> {
		const chat = await this.chatModel
			.findOne({
				$and: [
					{
						$or: [{ user1: user1Email }, { user1: user2Email }],
					},
					{
						$or: [{ user2: user1Email }, { user2: user2Email }],
					},
				],
			})
			.sort({ createdAt: -1 });
		if (!chat) {
			return null;
		}

		return chat;
	}

	//? If the chat not exists, return null;

	/**
	 * Get user chat and update messages array
	 * @param userChat
	 * @param message
	 * @returns true if success, false otherwise
	 */
	async updateChatMessages(
		userChat: ChatDocument,
		message: Message,
	): Promise<boolean> {
		// Append the message to the chat
		userChat.messages.push(message);

		// save the chat
		await userChat.save();

		return true;
	}

	/**
	 * Save chat if exists or create new one
	 * @param chat - Chat instance
	 */
	async saveChat({ message, sender, recipient }): Promise<Chat> {
		const myChat = await this.findPrivateChat(sender, recipient);
		if (myChat) {
			const newMessage = sender.concat(': ', message);
			this.updateChatMessages(myChat, newMessage);
			await myChat.save();
		} else {
			const createdChat = new this.chatModel();
			const newMessage = sender.concat(': ', message);
			createdChat.messages.push(newMessage);
			createdChat.user1 = sender;
			createdChat.user2 = recipient;
			await createdChat.save();
			return createdChat;
		}
	}
}
