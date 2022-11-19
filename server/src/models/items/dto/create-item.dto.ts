import {
	ArrayMaxSize,
	ArrayMinSize,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';
import {
	HasMimeType,
	IsFile,
	IsFiles,
	MaxFileSize,
	MemoryStoredFile,
} from 'nestjs-form-data';

import { ItemStatus } from '../enums/item-status.enum';
export class CreateItemDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	name: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	shortDescription: string;

	@IsString()
	@IsOptional()
	detailedDescription: string;

	@IsString()
	@IsOptional()
	brand: string;

	@IsEnum(ItemStatus)
	status: ItemStatus;

	@IsString()
	@IsOptional()
	color: string;

	@IsString()
	@IsOptional()
	investigationLocation?: string; // Location on map

	@IsNotEmpty({ message: 'Please provide valid item images 📷' })
	@ArrayMinSize(3, { message: 'Please provide at least 3 images 📷' })
	@ArrayMaxSize(5, { message: 'Please provide at most 5 images 📷' })
	@IsFiles()
	@MaxFileSize(1e6, { each: true })
	@HasMimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/gif'], {
		each: true,
	})
	// image: MemoryStoredFile;
	images: any;
}
