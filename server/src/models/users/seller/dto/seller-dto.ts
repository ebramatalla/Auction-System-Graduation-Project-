import { Expose } from 'class-transformer';
import { UserDto } from '../../shared-user/dto';

export class SellerDto extends UserDto {
	@Expose()
	rating: number; // Seller rating out of 5

	@Expose()
	isBlocked: boolean;

	@Expose()
	blockReason: string;

	@Expose()
	isWarned: boolean;

	@Expose()
	warningMessage: string;
}
