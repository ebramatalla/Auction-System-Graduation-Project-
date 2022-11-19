import { IsMongoId } from 'class-validator';

export class JoinOrLeaveAuctionDto {
	@IsMongoId({ message: 'Invalid auction id ❌' })
	auctionId: string;
}
