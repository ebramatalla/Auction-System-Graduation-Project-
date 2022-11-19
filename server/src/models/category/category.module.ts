import { CategoryController } from './category.controller';
import { forwardRef, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './category.service';
import {
	Category,
	CategoryDocument,
	CategorySchema,
} from './schema/category.schema';
import { AuctionsModule } from '../auction/auctions.module';
import { AuctionsService } from '../auction/auctions.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Category.name,
				imports: [AuctionsModule],
				useFactory: (auctionService: AuctionsService) => {
					const logger: Logger = new Logger(CategoryModule.name);
					const schema = CategorySchema;
					/**
					 * Pre hook to remove the item related to the auction
					 */
					schema.pre<CategoryDocument>('remove', async function () {
						logger.log(`Removing all auctions of category ${this.name}...🧺`);

						//* Remove all auctions that related to that category
						await auctionService.removeAllCategoryAuctions(this._id);
					});

					return schema;
				},
				inject: [AuctionsService],
			},
		]),
		forwardRef(() => AuctionsModule),
	],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService],
})
export class CategoryModule {}
