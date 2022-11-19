import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ObjectId } from 'mongoose';
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	ConnectedSocket,
	WsException,
} from '@nestjs/websockets';
import { BidService } from './bid.service';
import { SocketAuthGuard } from 'src/common/guards';
import { Buyer } from '../users/buyer/schema/buyer.schema';
import { GetCurrentUserFromSocket, Roles } from 'src/common/decorators';
import { JoinOrLeaveAuctionDto, PlaceBidDto } from './dto';
import { AuctionRoomService } from './auction-room.service';
import { AuctionsService } from '../auction/auctions.service';
import { BuyerService } from '../users/buyer/buyer.service';
import { Auction } from '../auction/schema/auction.schema';
import { AuctionStatus } from '../auction/enums';
import { NewBid } from './types/new-bid.type';
import { SocketService } from 'src/providers/socket/socket.service';
import { Role } from '../users/shared-user/enums';
import { ResponseResult } from 'src/common/types';

/**
 * Its job is to handle the bidding process.
 */
@WebSocketGateway({
	namespace: 'auction/bidding', // To be access as localhost:8000/auction/bidding
	cors: {
		origin: '*',
	},
})
export class BidGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@Inject()
	private socketService: SocketService;

	@Inject()
	private bidService: BidService;

	@Inject()
	private auctionRoomService: AuctionRoomService;

	@Inject()
	private auctionService: AuctionsService;

	@Inject()
	private buyerService: BuyerService;

	//* Attaches native Web Socket Server to a given property.
	@WebSocketServer()
	server: Server;

	//? Create logger instance
	private logger: Logger = new Logger(BidGateway.name);

	/**
	 * Run when the service initialises
	 */
	afterInit(server: Server) {
		this.logger.log('BidGateway initialized ⚡⚡');

		//* Initialize the socket of Socket Service to can use the socket globally
		this.socketService.socket = server;
	}

	/**
	 * Fires when the client be connected
	 */
	async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
		//* Check if the client already in auction, to add him to the room
		//* Get the user
		const bidder = await this.bidService.getConnectedClientUserObject(client);

		//* Ensure that the connected client is bidder
		if (bidder.role !== Role.Buyer) {
			return this.logger.error('The client is not a bidder 🤔');
		}

		//* Get the auctions that the bidder involved in
		const bidderAuctions: Auction[] = await this.buyerService.listMyAuctions(
			bidder._id.toString(),
		);

		//* Loop over the auctions and keep track to those still ongoing
		const auctionsToBeJoined: ObjectId[] = [];
		bidderAuctions.forEach((auction: Auction) => {
			if (auction.status === AuctionStatus.OnGoing) {
				auctionsToBeJoined.push(auction._id);
			}
		});

		//? Join the auctions if exists
		if (auctionsToBeJoined) {
			//* Add the bidder to the auction's rooms
			auctionsToBeJoined.forEach(auctionId => {
				//* Join the client to auction room
				client.join(auctionId.toString());
				this.auctionRoomService.addBidder({
					socketId: client.id,
					userId: bidder._id,
					email: bidder.email,
					room: String(auctionId),
				});

				//* Send greeting messages
				client.emit('message-to-client', {
					message:
						'Welcome ' + bidder.name + ', now you can start bidding 🐱‍🏍💲',
					system: true, // To be used to identify the message as system message
				});

				//* Send message to all room members except this client
				client.broadcast.to(auctionId.toString()).emit('message-to-client', {
					message: 'Ooh, new bidder joined the auction 👏🏻⚡⚡',
					system: true, // To be used to identify the message as system message
				});

				//* Handle the room data to be sent to the client
				this.handleRoomData(auctionId.toString());
			});

			this.logger.debug(
				`${bidder.name} connected to the bidding ws 🤔 and joined auctions rooms ${auctionsToBeJoined.length} successfully`,
			);
		}
	}

	/**
	 * Fires when the client disconnected
	 */
	async handleDisconnect(client: Socket) {
		//* Remove the bidder from the list
		const removedBidder = this.auctionRoomService.removeBidder(client.id);

		//? Ensure that the bidder removed from the room
		if (removedBidder) {
			this.logger.warn('Bidder disconnected from the bidding ws 🤔');
		}
	}

	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('place-bid')
	async handleIncomingBid(
		@ConnectedSocket() client: Socket,
		@MessageBody() { auctionId, bidValue }: PlaceBidDto,
		@GetCurrentUserFromSocket() bidder: Buyer,
	) {
		//* Ensure that the bid value provided
		if (!bidValue || !auctionId) {
			throw new WsException('Room and Bid value are required');
		}

		//* Get the bidder from the room
		const savedBidder = this.auctionRoomService.getBidder(client.id, auctionId);
		if (!savedBidder) {
			throw new WsException('You are not in this auction room ❌');
		}

		//* Handle the bid and update auction details
		const createdBid: NewBid = await this.bidService.HandleBid(
			auctionId,
			bidder._id,
			bidValue,
		);

		//? Check if the bid in last minute to add 3 minutes delay
		const result: ResponseResult =
			await this.bidService.handleIfBidInLastMinute(
				createdBid.createdAt,
				auctionId,
			);

		if (result.success) {
			this.server.to(auctionId).emit('message-to-client', {
				message: `Auction time extended by 3 minutes 🕒, as ${bidder.name} place bid in last minute.`,
			});
		}

		//* Emit the bid to the client-side
		this.server.to(auctionId).emit('new-bid', createdBid);

		//* Handle the room data to be sent to the client
		this.handleRoomData(auctionId);

		//* Log bid to the console
		this.logger.log(
			"'" + bidder.email + "' placed bid of '" + bidValue + "' 💰",
		);
	}

	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('leave-auction')
	async handleLeaveAuction(
		@ConnectedSocket() client: Socket,
		@MessageBody() { auctionId }: JoinOrLeaveAuctionDto,
		@GetCurrentUserFromSocket() bidder: Buyer,
	) {
		if (!auctionId) {
			throw new WsException('You must provide valid auction id 😉');
		}

		this.logger.debug(
			"'" +
				bidder.email +
				"' want to retreat from auction with id '" +
				auctionId +
				"'",
		);

		//* Check if the bidder can retreat or not
		await this.bidService.retreatBidderFromAuction(bidder, auctionId);

		//* Remove the bidder from the list
		const removedBidder = this.auctionRoomService.removeBidder(client.id);

		//? Ensure that the bidder removed from the room
		if (removedBidder) {
			this.logger.log(
				'Bidder left auction 👎🏻, with email: ' + removedBidder.email,
			);

			client.emit('message-to-client', {
				message: `You left the auction 🚪, auction's assurance refunded to your wallet 👍🏻💲 `,
			});

			//* Leave the bidder from the room
			client.leave(auctionId);

			this.server.to(removedBidder.room).emit('message-to-client', {
				message: `With sorry, ${bidder.email} left 😑`,
				system: true, // To be used to identify the message as system message
			});

			//* Handle the room data to be sent to the client
			this.handleRoomData(removedBidder.room);
		}
	}

	@UseGuards(SocketAuthGuard)
	@SubscribeMessage('get-winner')
	async getAuctionWinner(@MessageBody() { auctionId }: JoinOrLeaveAuctionDto) {
		//* Ensure that the auctionId provided
		if (!auctionId) {
			throw new WsException('auctionId is required ❌');
		}

		//* Get auction winner
		const winnerBidder = await this.auctionService.getAuctionWinner(auctionId);

		if (!winnerBidder) {
			this.server.to(auctionId.toString()).emit('winner-bidder', {
				success: false,
				message: 'No winner for this auction🤔',
				system: true,
			});
			return;
		}

		//* Send message to all bidders except this bidder
		this.server.to(auctionId.toString()).emit('winner-bidder', {
			message: `Winner is ${winnerBidder.email} 🐱‍🏍🏆`,
			winnerEmail: winnerBidder.email,
			winnerMessage:
				'You are the winner 🏆, congratulations!, check your email for the delivery details 😃',
			system: true,
		});
	}

	/*--------------------------*/
	/**
	 * Get auction details and emit the data to all room members
	 * @param auctionId - Auction id (room)
	 */
	private async handleRoomData(auctionId: string) {
		//* Get auction current bidders list
		const bidders = this.auctionRoomService.getBiddersInAuctionRoom(
			auctionId.toString(),
		);

		//* Get auction details (current bid, numOfBids etc)
		const auctionDetails =
			await this.auctionService.getCurrentAuctionDetailsForBidding(
				auctionId.toString(),
			);

		//* Get auction list of bids
		const bids = await this.bidService.getAuctionBids(auctionId);

		//* Emit room data to the client-side
		this.server.to(auctionId.toString()).emit('room-data', {
			room: auctionId,
			bidders,
			auctionDetails,
			bids,
		});
	}
}
