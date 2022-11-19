import { IsString } from 'class-validator';

export class FindReviewInSeller {
	@IsString()
	sellerId: string;
}
