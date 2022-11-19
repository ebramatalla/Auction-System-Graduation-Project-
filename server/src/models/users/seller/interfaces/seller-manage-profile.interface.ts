import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { ResponseResult } from 'src/common/types';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { Review } from 'src/models/review/schema/review.schema';
import { ChangePasswordDto, UserUpdateDto } from '../../shared-user/dto';
import { Seller } from '../schema/seller.schema';

export interface SellerProfileBehaviors {
	//* Get seller profile
	getProfile({ id }: MongoObjectIdDto): Promise<{
		seller: Seller;
		auctions: Auction[];
		reviews: Review[];
	}>;

	//* Edit seller profile
	editProfile(
		userUpdateDto: UserUpdateDto,
		userId: string,
	): Promise<ResponseResult>;

	//* Change password
	changePassword(
		changePasswordDto: ChangePasswordDto,
		sellerId: string,
	): Promise<ResponseResult>;
}
