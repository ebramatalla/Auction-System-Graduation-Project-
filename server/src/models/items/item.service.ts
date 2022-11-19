import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageType } from 'src/common/types';
import { CloudinaryService } from 'src/providers/files-upload/cloudinary.service';
import { CreateItemDto } from './dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item, ItemDocument } from './schema/item.schema';

@Injectable()
export class ItemService {
	private logger: Logger = new Logger(ItemService.name);

	constructor(
		@InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
		private cloudinary: CloudinaryService,
	) {}

	/**
	 * Create new item
	 * @param itemData - The item data to be created
	 * @returns Created item instance
	 */
	async create(itemData: CreateItemDto) {
		//* Upload all uploaded files to cloudinary
		const images = await this.uploadItemImageToCloudinary(itemData.images);

		//* Create new item
		const createdItem = new this.itemModel({ ...itemData, images });

		//* Save the item
		await createdItem.save();

		return createdItem;
	}

	/**
	 * Update an item data
	 * @param itemData - New item data
	 * @return true if the item was updated, false otherwise
	 */
	async update(_id: string, updateItemDto: UpdateItemDto): Promise<boolean> {
		//* Omit the _id
		delete updateItemDto._id;

		let imagesUpdated = false;
		if (updateItemDto.images) {
			//* Upload the new images
			const images: ImageType[] = await this.uploadItemImageToCloudinary(
				updateItemDto.images,
			);

			//* Add the images to the update data
			updateItemDto.images = images;

			imagesUpdated = true;
		}

		const updatedItem = await this.itemModel.findByIdAndUpdate(
			_id,
			updateItemDto,
		);

		if (updatedItem) {
			//? Remove old image if there was one
			if (imagesUpdated && updatedItem.images) {
				//* Remove all existing images
				await this.cloudinary.destroyArrayOfImages(updatedItem.images);
			}

			return true;
		}

		return false;
	}

	/**
	 * Remove an item from the database by id
	 * @param _id - Item id to be removed
	 * @returns true if item was removed, false otherwise
	 */
	async remove(_id: string): Promise<boolean> {
		const item = await this.itemModel.findOne({ _id });
		if (!item)
			throw new NotFoundException('Auction not found for that seller❌');

		//* Remove the auction using this approach to fire the pre hook event
		await item.remove();

		return true;
	}

	/*-------------*/

	/**
	 * Upload array of uploaded images to cloudinary
	 * @param uploadedImages
	 * @returns
	 */
	async uploadItemImageToCloudinary(uploadedImages: any) {
		return this.cloudinary.uploadArrayOfImages(uploadedImages);
	}
}
