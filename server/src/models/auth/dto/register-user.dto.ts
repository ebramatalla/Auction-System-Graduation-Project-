import { Transform } from 'class-transformer';
import {
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength,
} from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { AvailableRolesForRegister } from 'src/models/users/shared-user/enums';

export class RegisterUserDto {
	@IsString()
	name = 'Anonymes';

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	// @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
	// 	message: 'Password is too weak (MUST: 1L, 1N, 1S)😢',
	// })
	// @MinLength(8)
	@MinLength(3)
	password: string;

	@IsNotEmpty()
	@Length(14, 14)
	nationalID: Number;

	@IsOptional()
	// @Transform(({ obj }) => {
	// 	//* Append +20 to the phone number
	// 	return `${obj.phoneNumber}`;
	// })
	@Length(11)
	@Matches(/^\+[1-9]\d{1,14}$/, {
		message: 'Phone number is invalid must start with (+2)',
	})
	phoneNumber: Number;

	@IsString()
	@IsOptional()
	address: string;

	@IsOptional()
	@IsFile()
	@MaxFileSize(1e6)
	@HasMimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/gif'])
	image: any;

	@IsEnum(AvailableRolesForRegister, {
		message: 'Role must be either seller or buyer 🙂',
	})
	role: AvailableRolesForRegister;
}
