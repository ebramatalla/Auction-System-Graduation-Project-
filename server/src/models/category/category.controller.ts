import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators';
import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { Serialize } from 'src/common/interceptors';
import { AuctionDto } from '../auction/dto';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@IsPublicRoute()
	@Serialize(CategoryDto)
	@Get()
	showAllCategories(@Query('name') name: string) {
		return this.categoryService.listAll(name);
	}

	/**
	 * List specific category auctions
	 * @param category id
	 * @returns List of category's auctions
	 */
	@IsPublicRoute()
	@Serialize(AuctionDto)
	@Get(':id/auctions')
	getAuctionsOfCategory(@Param() { id }: MongoObjectIdDto) {
		return this.categoryService.getAuctionsOfCategory(id);
	}
}
