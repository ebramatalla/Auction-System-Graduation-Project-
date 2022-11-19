import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwilioConfigService } from './twilio.config.service';
import configuration from './twilio.configuration';
import { getTwilioConfigValidationObj } from './twilio.validation-object';
/**
 * Import and provide mail configuration related classes.
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.development.env',
			load: [configuration],
			validationSchema: getTwilioConfigValidationObj(),
		}),
	],
	providers: [ConfigService, TwilioConfigService],
	exports: [ConfigService, TwilioConfigService],
})
export class TwilioConfigModule {}
