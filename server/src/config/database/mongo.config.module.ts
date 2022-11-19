import { Module } from '@nestjs/common';
import configuration from './mongo.configuration';
import { MongoConfigService } from './mongo.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.development.env',
			load: [configuration],
			validationSchema: Joi.object({
				DATABASE_CONNECTION_STRING: Joi.string().required(),
			}),
		}),
	],
	providers: [ConfigService, MongoConfigService],
	exports: [ConfigService, MongoConfigService],
})
export class MongoConfigModule {}
