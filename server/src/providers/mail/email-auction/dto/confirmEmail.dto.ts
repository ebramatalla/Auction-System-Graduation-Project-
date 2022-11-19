import { IsNotEmpty, IsNumber, IsEmail } from 'class-validator';

export class ConfirmVerificationCodeDto {
	@IsNumber()
	@IsNotEmpty()
	verificationCode: number;

	@IsEmail()
	@IsNotEmpty()
	email: string;
}

export default ConfirmVerificationCodeDto;
