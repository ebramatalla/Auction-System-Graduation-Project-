import {
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';
export class ResetPasswordDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsNumber()
	verificationCode: number;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
		message: 'Password is too weak (MUST: 1L, 1N, 1S)😢',
	})
	password: string;
}
