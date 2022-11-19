import { UseGuards, Logger, Inject } from '@nestjs/common';
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from 'src/common/guards';
import { User } from '../users/shared-user/schema/user.schema';
import { GetCurrentUserFromSocket } from './../../common/decorators/';
import { ChatService } from './chat.service';
import { RoomMembersService } from './room-members.service';
import { Chat } from './schema/chat.schema';

/**
 * Its job is to receive and send messages.
 */
@WebSocketGateway({
	namespace: 'chat', // To be access as lo localhost:8000/chat
	cors: {
		origin: '*',
	},
})
export class ChatGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@Inject()
	private chatService: ChatService;

	@Inject()
	private roomMembersServices: RoomMembersService;

	//* Attaches native Web Socket Server to a given property.
	@WebSocketServer()
	server: Server;

	//? Create logger instance
	private logger: Logger = new Logger('ChatGateway');

	/**
	 * Run when the service initialises
	 */
	afterInit(server: any) {
		this.logger.log('MessageGateway initialized ⚡⚡');
	}

	/**
	 * Fires when the client be connected
	 */
	async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
		//* Get the user
		const user: User = await this.chatService.getConnectedClientUserObject(
			client,
		);
		if (user.role == 'employee') {
			this.roomMembersServices.addEmployee({
				socketId: client.id,
				role: 'employee',
			});
			this.logger.log('New User Connected 👍🏻, with email: ' + user.email);
			this.logger.log('New User Connected 👍🏻, with role: ' + user.role);
		} else {
			//* Add the member to the list of all members
			this.roomMembersServices.addMember({
				socketId: client.id,
				email: user.email,
			});

			this.logger.log('New User Connected 👍🏻, with email: ' + user.email);
			this.logger.log('New User Connected 👍🏻, with role: ' + user.role);
		}
	}

	/**
	 * Fires when the client be disconnected
	 */
	async handleDisconnect(client: Socket) {
		//* Remove the member from the list of all members
		// if removed in frist condition so he is member if not so he is employee

		const removedMember = this.roomMembersServices.removeMember(client.id);
		if (removedMember) {
			this.logger.log(
				'User Disconnected 👎🏻, with email: ' + removedMember.email,
			);
		} else {
			const removedEmployee = this.roomMembersServices.removeEmployee(
				client.id,
			);
			this.logger.log(
				'User Disconnected 👎🏻, with email: ' + removedEmployee.role,
			);
		}
	}

	/*-------------------------------------------*/

	/*
	 * Get the chat history between the client and specific receiver
	 */
	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('get-chat-history')
	async getClientChatHistory(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { with: string },
		@GetCurrentUserFromSocket() user: User,
	) {
		// if employee so
		if (user.role == 'employee') {
			// Display log message
			this.logger.log(
				'Try to load chat-history between  Support and ' + data.with,
			);

			//? Get chat history of the client with the given receiver
			const chatHistory: Chat = await this.chatService.getAllClientChatHistory(
				'Support@email.com',
				data.with,
			);

			//* Send the chat history to the client back
			client.emit('chat-history-to-client', chatHistory);

			this.logger.log('Chat history loaded and emitted to user ✔✔');
		} else {
			// Display log message
			this.logger.log(
				'Try to load chat-history between ' + user.email + ' and ' + data.with,
			);

			//? Get chat history of the client with the given receiver
			const chatHistory: Chat = await this.chatService.getAllClientChatHistory(
				user.email,
				data.with,
			);

			//* Send the chat history to the client back
			client.emit('chat-history-to-client', chatHistory);

			this.logger.log('Chat history loaded and emitted to user ✔✔');
		}
	}

	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('get-MyChat')
	async MyChat(
		@ConnectedSocket() client: Socket,
		@GetCurrentUserFromSocket() user: User,
	) {
		// if employee so
		if (user.role == 'employee') {
			// Display log message
			//? Get chat history of the client with the given receiver
			const chatHistory: Chat = await this.chatService.getMyChat(
				'Support@email.com',
			);

			//* Send the chat history to the client back
			client.emit('MyChat', chatHistory);

			this.logger.log('Chat history loaded and emitted to user ✔✔');
		} else {
			// Display log message
			this.logger.log('Try to load chat-history between ' + user.email);

			//? Get chat history of the client with the given receiver
			const chatHistory: Chat = await this.chatService.getMyChat(user.email);

			//* Send the chat history to the client back
			client.emit('MyChat', chatHistory);

			this.logger.log('Chat history loaded and emitted to user ✔✔');
		}
	}

	/*
	 * a handler that will subscribe to the send_message messages and respond to the user with the exact same data.
	 */
	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('new-message-to-server')
	async listenForMessages(
		@MessageBody() data: { message: string; receiverEmail: string },
		@GetCurrentUserFromSocket() user: User,
		@ConnectedSocket() client: Socket,
	) {
		// Display log message
		this.logger.log(
			'New message recieved ❤ from ' + user.email + ' to ' + data.receiverEmail,
		);

		//* Handle the incoming message
		const message = await this.chatService.handleNewMessage(
			user.email,
			data.receiverEmail,
			data.message,
		);

		//? Prepare to send the message to the clients
		const messageTo = [client.id];

		//* Find the receiver socketId if he is online
		const receiverSocketId = this.roomMembersServices.getMemberSocketId(
			data.receiverEmail,
		);

		// Append the receiverSocketId to the list to receive the message
		if (receiverSocketId) {
			messageTo.push(receiverSocketId);
		}

		//* Emit the message
		this.server.to(messageTo).emit('new-message-to-client', message);
	}

	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('new-message-to-Support')
	async ToSupport(
		@MessageBody() data: { message: string },
		@GetCurrentUserFromSocket() user: User,
		@ConnectedSocket() client: Socket,
	) {
		const supportEmail = 'Support@email.com';
		// Display log message
		this.logger.log(
			'New message recieved ❤ from ' + user.email + ' to ' + supportEmail,
		);

		//* Handle the incoming message
		const message = await this.chatService.handleNewMessageToSupport(
			user.email,
			supportEmail,
			data.message,
		);

		//? Prepare to send the message to the clients
		const messageTo = [client.id];
		// this.logger.log(messageTo);

		//* Find the receiver socketId if he is online
		const SupportSocketId = this.roomMembersServices.getEmployeeSocketId();

		// Append the receiverSocketId to the list to receive the message
		if (SupportSocketId) {
			for (let i = 0; i < SupportSocketId.length; i++) {
				messageTo.push(SupportSocketId[i]);
			}
		}
		//* Emit the message
		this.server.to(messageTo).emit('new-message-to-Employee', message);
	}
	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('new-message-From-Support')
	async FromSupport(
		@MessageBody() data: { message: string; receiverEmail: string },
		@GetCurrentUserFromSocket() user: User,
		@ConnectedSocket() client: Socket,
	) {
		const supportEmail = 'Support@email.com';
		// Display log message
		this.logger.log(
			'New message received ❤ from ' + user.email + ' to ' + data.receiverEmail,
		);

		//* Handle the incoming message
		const message = await this.chatService.handleNewMessageFromSupport(
			user.email,
			data.receiverEmail,
			data.message,
		);

		//? Prepare to send the message to the clients
		const messageTo = [client.id];

		//* Find the receiver socketId if he is online
		const receiverSocketId = this.roomMembersServices.getMemberSocketId(
			data.receiverEmail,
		);

		// Append the receiverSocketId to the list to receive the message
		if (receiverSocketId) {
			messageTo.push(receiverSocketId);
		}

		//* Emit the message
		this.server.to(messageTo).emit('new-message-From-Employee', message);
	}
}
