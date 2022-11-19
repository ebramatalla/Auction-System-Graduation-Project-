import {
	IsEnum,
	IsOptional,
	IsMongoId,
	IsBooleanString,
} from 'class-validator';
import { AuctionStatus } from 'src/models/auction/enums';

export class AdminFilterAuctionQueryDto {
	@IsOptional()
	@IsEnum(AuctionStatus)
	status: AuctionStatus;

	@IsOptional()
	@IsMongoId()
	category: string;

	@IsOptional()
	@IsBooleanString()
	populate: string;
}
