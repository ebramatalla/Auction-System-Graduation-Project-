import { IsNotEmpty, IsString } from 'class-validator';

export class CheckVerificationCodeDto {
	@IsString()
	@IsNotEmpty()
	verificationCode: string;
}
