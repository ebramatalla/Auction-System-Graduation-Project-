import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { CreateItemDto } from 'src/models/items/dto';
export class UpdateItemDto extends PartialType(CreateItemDto) {
	//* Add the _id property to be used to update the item
	@IsNotEmpty()
	@IsMongoId()
	_id: string;
}
