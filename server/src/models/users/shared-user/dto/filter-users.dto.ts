import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../enums';

export class FilterUsersQueryDto {
	@IsOptional()
	@IsEnum(Role)
	role: Role;

	@IsOptional()
	@IsString()
	email: string;
}
