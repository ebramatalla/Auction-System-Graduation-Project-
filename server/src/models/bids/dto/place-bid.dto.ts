import { IsNumberString, IsString } from 'class-validator';

export class PlaceBidDto {
	@IsString()
	auctionId: string;

	@IsNumberString()
	bidValue: number;
}
