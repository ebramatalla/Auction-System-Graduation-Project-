import { Expose } from 'class-transformer';
import { ExposeObjectId } from '../../../../common/decorators/mongo/expose-id.decorator';

/**
 * User dto - Describe what user data to be sent over the network
 */
export class UserDto {
	@Expose()
	@ExposeObjectId() // This decorator to avoid ObjectId problem
	_id: string;

	@Expose()
	name: string;

	@Expose()
	email: string;

	@Expose()
	role: string;

	@Expose()
	image: any;

	@Expose()
	phoneNumber: Number;

	@Expose()
	isPhoneNumberConfirmed: boolean;

	@Expose()
	isEmailConfirmed: boolean;

	@Expose()
	address: String;

	@Expose()
	nationalID: Number;

	@Expose()
	isBlocked: boolean;

	@Expose()
	blockReason: string;

	@Expose()
	isWarned: boolean;

	@Expose()
	warningMessage: string;
}
