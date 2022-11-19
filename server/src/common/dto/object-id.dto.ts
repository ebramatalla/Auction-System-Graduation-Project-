import { IsMongoId } from 'class-validator';

/*
 * This is to ensure that the id is a valid mongo id.
 */
export class MongoObjectIdDto {
	@IsMongoId({ message: 'Invalid id ❌' })
	id: string;
}
