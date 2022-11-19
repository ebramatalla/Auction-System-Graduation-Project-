import { ObjectId } from 'mongoose';

export type AuctionRoomMember = {
	socketId: string;
	room: string;
	userId: ObjectId;
	email: string;
};
