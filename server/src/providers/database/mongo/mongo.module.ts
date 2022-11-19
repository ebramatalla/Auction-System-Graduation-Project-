import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigModule } from 'src/config/database/mongo.config.module';
import { MongoConfigService } from 'src/config/database/mongo.config.service';
@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [MongoConfigModule],
			useFactory: (config: MongoConfigService) => ({
				uri: config.connectionString,
			}),
			inject: [MongoConfigService],
		}),
	],
})

//* Used in app.module.ts to initialize the database
export class MongoDatabaseProviderModule {}
