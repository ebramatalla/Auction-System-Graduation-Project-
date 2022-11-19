import { Expose, Transform } from 'class-transformer';
import { ExposeObjectId } from 'src/common/decorators';
import { SerializeIt } from 'src/common/utils';
import { UserDto } from 'src/models/users/shared-user/dto';
import { User } from 'src/models/users/shared-user/schema/user.schema';

export class WalletDto {
	@Expose()
	@ExposeObjectId()
	_id: string;

	@Expose()
	balance: number;

	@Expose()
	@Transform(({ obj }) => {
		return SerializeIt(UserDto, obj.user);
	})
	user: User;
}
