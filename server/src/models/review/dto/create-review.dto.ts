import {
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';

import { ObjectId } from 'mongoose';

export class CreateReviewDto {
	@IsNotEmpty()
	@IsMongoId()
	seller: ObjectId;

	@IsNotEmpty()
	@IsString()
	@MinLength(3)
	@MaxLength(1000)
	message: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Max(5)
	review: Number;
}
