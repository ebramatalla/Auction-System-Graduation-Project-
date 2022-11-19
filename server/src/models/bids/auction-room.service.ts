import { Injectable } from '@nestjs/common';
import { AuctionRoomMember } from './types/auction-room-member.type';

@Injectable()
export class AuctionRoomService {
	private onlineBidders: any = new Array();

	/**
	 * Add new bidder to the list
	 * @param AuctionRoomMember - bidder data
	 * @returns bidder if added || null
	 */
	addBidder({ socketId, userId, email, room }: AuctionRoomMember) {
		// Validate data
		if (!socketId || !userId || !email || !room) {
			return null;
		}

		// Clean data
		email = email.trim().toLowerCase();

		//? Check if already exists in the room
		const existingBidder = this.onlineBidders.find(
			(bidder: AuctionRoomMember) =>
				bidder.room === room && bidder.email === email,
		);

		if (existingBidder) {
			return null;
		}

		//* Add the bidder
		const bidder = { socketId, userId, email, room };

		this.onlineBidders.push(bidder);

		return bidder;
	}

	/**
	 * Remove bidder from the list
	 * @param socketId
	 * @returns removed bidder if removed || null
	 */
	removeBidder(socketId: string) {
		const index = this.onlineBidders.findIndex(
			member => member.socketId === socketId,
		);

		if (index !== -1) {
			return this.onlineBidders.splice(index, 1)[0];
		} else {
			return null;
		}
	}

	/**
	 * Get bidder from any filter
	 * @param filter Member email
	 * @returns bidder
	 */
	getBidder(socketId: string, room: string) {
		const member = this.onlineBidders.find(
			member => member.socketId === socketId && member.room === room,
		);

		return member;
	}

	/**
	 * Search fot the winner bidder in the online members list
	 * @param userId
	 * @param room
	 * @returns winner bidder socket id if found
	 */
	getWinnerBidder(userId: string, room: string) {
		const winner = this.onlineBidders.find(
			(member: { userId: string; room: string }) => {
				return (
					member.userId.toString() == userId.toString() && member.room == room
				);
			},
		);

		return winner?.socketId ? winner.socketId : null;
	}

	/**
	 * Return list of all available bidders in specific room
	 * @param room - room name
	 */
	getBiddersInAuctionRoom(room: string) {
		room = room.trim().toLowerCase();
		const roomBidders = this.onlineBidders.filter(
			bidder => bidder.room === room,
		);

		//* Return only the email and userId
		const serializedRoomBidder = roomBidders.map(
			(bidder: AuctionRoomMember) => {
				return {
					userId: bidder.userId,
					email: bidder.email,
				};
			},
		);
		return serializedRoomBidder;
	}
}
