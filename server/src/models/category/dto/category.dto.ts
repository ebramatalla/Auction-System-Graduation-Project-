import { Expose } from 'class-transformer';
import { ExposeObjectId } from 'src/common/decorators';

/**
 * Category dto - Describe what category data to be sent over the network
 */
export class CategoryDto {
	@Expose()
	@ExposeObjectId()
	_id: string;

	@Expose()
	name: string;

	@Expose()
	auctionsCount: number;
}
