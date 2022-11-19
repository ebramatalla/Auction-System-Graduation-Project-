import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionsModule } from '../auction/auctions.module';
import { AuthModule } from '../auth/auth.module';
import { BuyerModule } from '../users/buyer/buyer.module';
import { AuctionRoomService } from './auction-room.service';
import { BidController } from './bid.controller';
import { BidGateway } from './bid.gateway';
import { BidService } from './bid.service';
import { Bid, BidSchema } from './schema/bid.schema';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Bid.name,
				useFactory: () => {
					const schema = BidSchema;
					//? Add the auto-populate plugin
					schema.plugin(require('mongoose-autopopulate'));
					return schema;
				},
			},
		]),
		AuthModule,
		AuctionRoomService,
		AuctionsModule,
		BuyerModule,
	],
	controllers: [BidController],
	providers: [BidService, BidGateway, AuctionRoomService],
})
export class BidModule {}
