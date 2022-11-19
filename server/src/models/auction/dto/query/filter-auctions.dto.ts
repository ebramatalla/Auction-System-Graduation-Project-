import { IsEnum, IsOptional, IsBooleanString, IsString } from 'class-validator';
import { AuctionStatusForSearch } from '../../enums';

export class FilterAuctionQueryDto {
	@IsOptional()
	@IsEnum(AuctionStatusForSearch, {
		message: 'Sorry, status must be one of [upcoming, ongoing, closed] 👀',
	})
	status: AuctionStatusForSearch;

	@IsOptional()
	@IsString()
	category: string;

	@IsOptional()
	@IsBooleanString()
	populate: string;
}
