import { Module, Logger, forwardRef } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
	Auction,
	AuctionDocument,
	AuctionSchema,
} from './schema/auction.schema';
import { ItemModule } from '../items/item.module';
import { CategoryModule } from '../category/category.module';
import { ItemService } from './../items/item.service';
import { AuctionValidationService } from './auction-validation.service';
import { AuctionsController } from './auctions.controller';
import { AuctionSchedulingService } from 'src/providers/schedule/auction/auction-scheduling.service';
import { WalletModule } from 'src/providers/payment/wallet.module';
import { BiddingIncrementRules } from 'src/providers/bids';
import { BuyerModule } from '../users/buyer/buyer.module';
import { BuyerService } from '../users/buyer/buyer.service';
import { AuctionEmailsModule } from 'src/providers/mail/email-auction/auction-emails.module';

@Module({
	imports: [
		ItemModule,
		forwardRef(() => CategoryModule),
		forwardRef(() => BuyerModule),
		WalletModule,
		AuctionEmailsModule,
		MongooseModule.forFeatureAsync([
			{
				name: Auction.name,
				imports: [ItemModule, BuyerModule],
				useFactory: (itemService: ItemService, buyerService: BuyerService) => {
					const logger: Logger = new Logger('Auction Module');
					const schema = AuctionSchema;
					//? Add the auto-populate plugin
					schema.plugin(require('mongoose-autopopulate'));

					/**
					 * Pre hook to remove the item related to the auction
					 */
					schema.pre<AuctionDocument>('remove', async function () {
						//* Remove the item by id
						//@ts-ignore
						await itemService.remove(this.item._id);
						logger.log('Removing the item related to that auction...🧺');

						//* Remove the auction from the user's saved auctions
						await buyerService.removeAuctionFromSavedAuctions(
							this._id.toString(),
						);
					});

					return schema;
				},
				inject: [ItemService, BuyerService],
			},
		]),
	],
	controllers: [AuctionsController],
	providers: [
		AuctionsService,
		AuctionValidationService,
		BiddingIncrementRules,
		AuctionSchedulingService,
	],
	exports: [
		AuctionsService,
		MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
	],
})
export class AuctionsModule {}
