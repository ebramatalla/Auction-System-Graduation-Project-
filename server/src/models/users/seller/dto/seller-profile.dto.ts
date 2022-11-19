import { Expose, Transform } from 'class-transformer';
import { SerializeIt } from 'src/common/utils';
import { AuctionDto } from 'src/models/auction/dto';
import { Auction } from 'src/models/auction/schema/auction.schema';
import { ReviewDto } from 'src/models/review/dto/review.dto';
import { Review } from 'src/models/review/schema/review.schema';
import { SellerDto } from './seller-dto';

export class SellerProfileDto {
	@Expose()
	@Transform(({ obj }) => {
		return SerializeIt(SellerDto, obj.seller);
	})
	seller: SellerDto;

	@Expose()
	@Transform(({ obj }) => {
		return SerializeIt(AuctionDto, obj.auctions);
	})
	auctions: Auction[];

	@Expose()
	@Transform(({ obj }) => {
		return SerializeIt(ReviewDto, obj.reviews);
	})
	reviews: Review[];
}
