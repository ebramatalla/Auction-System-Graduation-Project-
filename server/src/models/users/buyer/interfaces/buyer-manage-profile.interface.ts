import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { ResponseResult } from 'src/common/types';
import { ChangePasswordDto, UserUpdateDto } from '../../shared-user/dto';
import { Buyer } from '../schema/buyer.schema';

export interface BuyerProfileBehaviors {
	//* Get buyer profile
	getProfile({ id: buyerId }: MongoObjectIdDto): Promise<Buyer>;

	//* Edit buyer profile
	editProfile(
		userUpdateDto: UserUpdateDto,
		buyerId: string,
	): Promise<ResponseResult>;

	//* Change password
	changePassword(
		changePasswordDto: ChangePasswordDto,
		sellerId: string,
	): Promise<ResponseResult>;
}
