import { ItemService } from './item.service';

import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemDocument, ItemSchema } from './schema/item.schema';
import { CloudinaryModule } from 'src/providers/files-upload/cloudinary.module';
import { CloudinaryService } from 'src/providers/files-upload/cloudinary.service';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: Item.name,
				imports: [CloudinaryModule],
				useFactory: (cloudinaryService: CloudinaryService) => {
					const logger: Logger = new Logger('Item Module');
					const schema = ItemSchema;
					/**
					 * Pre hook to remove the item image related to the item
					 */
					schema.pre<ItemDocument>('remove', async function () {
						logger.log('Removing item image....🧺');

						//* Remove all item images
						await cloudinaryService.destroyArrayOfImages(this.images);
					});

					return schema;
				},
				inject: [CloudinaryService],
			},
		]),
		CloudinaryModule,
	],
	controllers: [],
	providers: [ItemService],
	exports: [ItemService],
})
export class ItemModule {}
