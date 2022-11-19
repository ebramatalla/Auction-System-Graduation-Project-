import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(
	//* Buyer cannot update seller object
	OmitType(CreateReviewDto, [`seller`]),
) {}
