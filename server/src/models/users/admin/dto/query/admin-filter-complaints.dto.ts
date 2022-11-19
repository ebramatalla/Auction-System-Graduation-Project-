import { IsOptional, IsBooleanString, IsMongoId } from 'class-validator';

export class AdminFilterComplaintQueryDto {
	@IsBooleanString()
	@IsOptional()
	markedAsRead: boolean;

	@IsMongoId()
	@IsOptional()
	in: string;
}
