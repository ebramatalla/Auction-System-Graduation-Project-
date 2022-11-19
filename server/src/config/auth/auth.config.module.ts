import { Module } from '@nestjs/common';
import configuration from './auth.configuration';
import { AuthConfigService } from './auth.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAuthConfigValidationObj } from './auth.validation-object';
/**
 * Import and provide auth configuration related classes.
 *
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.development.env',
			load: [configuration],
			validationSchema: getAuthConfigValidationObj(),
		}),
	],
	providers: [ConfigService, AuthConfigService],
	exports: [ConfigService, AuthConfigService],
})
export class AuthConfigModule {}
