import {
	IsMongoId,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';

export class CreateComplaintDto {
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(100)
	reason: string;

	//* From field will determined by the current logged in user

	@IsNotEmpty()
	@IsMongoId()
	in: Seller | Buyer;
}
