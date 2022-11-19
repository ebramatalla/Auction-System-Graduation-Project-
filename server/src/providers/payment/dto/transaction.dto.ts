import { Expose, Transform } from 'class-transformer';
import { ExposeObjectId } from '../../../common/decorators/mongo/expose-id.decorator';
import { SerializeIt } from 'src/common/utils';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { UserDto } from 'src/models/users/shared-user/dto';
import { TransactionType } from '../enums';
import { User } from 'src/models/users/shared-user/schema/user.schema';

/**
 * Transaction dto - Describe what transaction data to be sent over the network
 */
export class TransactionDto {
	@Expose()
	@ExposeObjectId()
	_id: string;

	@Expose()
	amount: number;

	@Expose()
	@Transform(({ obj }) => {
		//* Serialize the sender object to remove the sensitive data
		return SerializeIt(UserDto, obj.sender);
	})
	sender: User;

	@Expose()
	@Transform(({ obj }) => {
		//* Serialize the sender object to remove the sensitive data
		return SerializeIt(UserDto, obj.recipient);
	})
	recipient: User;

	@Expose()
	transactionType: TransactionType;

	@Expose()
	isBlockAssuranceTransaction: boolean;

	@Expose()
	paymentIntentId: string;

	@Expose()
	createdAt: string;
}
