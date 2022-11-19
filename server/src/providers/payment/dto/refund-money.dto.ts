import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class RefundWalletDto {
	@IsString()
	@IsNotEmpty()
	paymentIntentId: string;
}
