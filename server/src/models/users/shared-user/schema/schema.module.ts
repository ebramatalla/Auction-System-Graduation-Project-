import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
	adminModelProvider,
	buyerModelProvider,
	employeeModelProvider,
	sellerModelProvider,
} from '../providers/discriminators/discriminator.provider';
import { User, UserSchema } from './user.schema';

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
				//* Discriminators are provided manually (see model providers)
			},
		]),
	],
	providers: [
		adminModelProvider, // Provide it so it is injectable by getModelToken(Admin.name)]
		employeeModelProvider, // Provide it so it is injectable by getModelToken(Employee.name)]
		sellerModelProvider, // Provide it so it is injectable by getModelToken(Seller.name)]
		buyerModelProvider, // Provide it so it is injectable by getModelToken(Buyer.name)]
	],
	exports: [
		MongooseModule,
		adminModelProvider, // Export it so it is injectable by getModelToken(Admin.name)],
		employeeModelProvider, // Export it so it is injectable by getModelToken(Employee.name)],
		sellerModelProvider, // Export it so it is injectable by getModelToken(Seller.name)],
		buyerModelProvider, // Export it so it is injectable by getModelToken(Buyer.name)],
	],
})
export class SchemaModule {}
