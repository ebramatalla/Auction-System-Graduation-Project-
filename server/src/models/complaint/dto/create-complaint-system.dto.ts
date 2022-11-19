import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateComplaintInSystemDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	reason: string;

	//* From field will determined by the current logged in user

	@IsNotEmpty()
	@IsEmail()
	from: string;
}
