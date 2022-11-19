import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResendVerificationCodeDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;
}

export default ResendVerificationCodeDto;
