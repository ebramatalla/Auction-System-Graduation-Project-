import { IsNumberString, IsOptional, Max, Min } from 'class-validator';

export class GetTopAuctionsDto {
	@IsNumberString()
	@IsOptional()
	top?: number;
}
