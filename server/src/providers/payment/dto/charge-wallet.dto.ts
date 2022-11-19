import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ChargeWalletDto {
	@IsString()
	@IsNotEmpty()
	paymentMethodId: string;

	@IsNumber()
	@Min(100)
	amount: number;
}
