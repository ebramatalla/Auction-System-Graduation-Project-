import { IsNotEmpty, IsString } from 'class-validator';

export class RejectAuctionDto {
	@IsString()
	message: string = 'NO REASON SUPPLIED 😢';
}
