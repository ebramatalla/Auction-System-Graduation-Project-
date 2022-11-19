import { Type } from 'class-transformer';
import {
	IsDate,
	IsMongoId,
	IsNotEmpty,
	IsNumberString,
	IsString,
	ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';

import { CreateItemDto } from 'src/models/items/dto';

export class CreateAuctionDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@Type(() => CreateItemDto)
	@ValidateNested() //? To validate item fields
	item: CreateItemDto;

	@IsNotEmpty()
	@IsNumberString()
	basePrice: number;

	@IsDate()
	@Type(() => Date)
	startDate: Date;
	@IsMongoId()
	category: ObjectId;
}
