import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryConfigService } from './cloudinary.config.service';
import configuration from './cloudinary.configuration';
import { getCloudinaryConfigValidationObj } from './cloudinary.validation-object';
/**
 * Import and provide mail configuration related classes.
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.development.env',
			load: [configuration],
			validationSchema: getCloudinaryConfigValidationObj(),
		}),
	],
	providers: [ConfigService, CloudinaryConfigService],
	exports: [ConfigService, CloudinaryConfigService],
})
export class CloudinaryConfigModule {}
