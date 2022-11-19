import { Expose, Transform } from 'class-transformer';
import { ExposeObjectId } from 'src/common/decorators';
import { SerializeIt } from 'src/common/utils';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { UserDto } from 'src/models/users/shared-user/dto';

export class ComplaintDto {
	@Expose()
	@ExposeObjectId()
	_id: string;

	@Expose()
	reason: string;

	@Expose()
	@Transform(({ obj }) => {
		return SerializeIt(UserDto, obj.from);
	})
	from: Seller | Buyer;

	@Expose()
	@Transform(({ obj }) => {
		return SerializeIt(UserDto, obj.in);
	})
	in: Seller | Buyer;

	@Expose()
	markedAsRead: boolean;

	@Expose()
	inSystem: boolean;

	@Expose()
	createdAt: Date;
}
