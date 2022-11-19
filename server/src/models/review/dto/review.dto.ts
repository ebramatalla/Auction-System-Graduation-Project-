import { Expose, Transform } from 'class-transformer';
import { ExposeObjectId } from 'src/common/decorators';
import { SerializeIt } from 'src/common/utils';
import { BuyerDto } from 'src/models/users/buyer/dto';

export class ReviewDto {
	@Expose()
	@ExposeObjectId()
	_id: string;

	@Expose()
	message: string;

	@Expose()
	review: number;

	@Expose()
	@Transform(({ obj }) => {
		//* Serialize  the item object to remove the sensitive data
		return SerializeIt(BuyerDto, obj.buyer);
	})
	buyer: BuyerDto;

	@Expose()
	updatedAt: string;
}
