import { Module } from '@nestjs/common';
import configuration from './app.configuration';
import { AppConfigService } from './app.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAppConfigValidationObj } from './app.validation-object';
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
			validationSchema: getAppConfigValidationObj(),
		}),
	],
	providers: [ConfigService, AppConfigService],
	exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
