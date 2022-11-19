import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateItemDto } from 'src/models/items/dto/update-item.dto';
import { CreateAuctionDto } from './create-auction.dto';

//? export class UpdateAuctionDto extends PartialType(CreateAuctionDto) and omit `item` from it
export class UpdateAuctionDto extends PartialType(
	OmitType(CreateAuctionDto, [`item`, 'startDate']),
) {
	//* Add item again but with UpdateItemDto type.
	@IsOptional()
	@IsNotEmpty()
	@Type(() => UpdateItemDto)
	@ValidateNested() //? To validate item fields
	item: UpdateItemDto;
}
