import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	@IsNotEmpty()
	@IsString()
	// @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
	// 	message: 'Password is too weak (MUST: 1L, 1N, 1S)😢',
	// })
	// @MinLength(8)
	@MinLength(3)
	newPassword: string;
}
