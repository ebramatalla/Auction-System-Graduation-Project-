import { Expose, Transform } from 'class-transformer';

export class BidDto {
	@Expose()
	@Transform(({ obj }) => {
		return obj.user?.email;
	})
	userEmail: string;

	@Expose()
	amount: number;

	@Expose()
	createdAt: Date;
}
