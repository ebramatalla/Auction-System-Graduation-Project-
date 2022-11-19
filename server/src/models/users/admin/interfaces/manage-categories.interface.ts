import { MongoObjectIdDto } from 'src/common/dto/object-id.dto';
import { CreateCategoryDto, UpdateCategoryDto } from 'src/models/category/dto';
import { CategoryDocument } from 'src/models/category/schema/category.schema';

/*
 ? This interface include all functions related to the category
 */

export interface AdminCategoryBehaviors {
	//* Create new category
	addCategory(body: CreateCategoryDto): Promise<CategoryDocument>;

	//* List all categories
	showAllCategories(name: string): Promise<CategoryDocument[]>;

	//* Get single category
	getCategory(id: MongoObjectIdDto): Promise<CategoryDocument>;

	//* Update existing category
	updateCategory(
		id: MongoObjectIdDto,
		updateCategoryDto: UpdateCategoryDto,
	): Promise<CategoryDocument>;

	//* Delete single category
	deleteCategory(id: MongoObjectIdDto): Promise<CategoryDocument>;
}
