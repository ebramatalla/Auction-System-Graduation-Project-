import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailConfigService } from './mail.config.service';
import configuration from './mail.configuration';
import { getMailConfigValidationObj } from './mail.validation-object';
/**
 * Import and provide mail configuration related classes.
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.development.env',
			load: [configuration],
			validationSchema: getMailConfigValidationObj(),
		}),
	],
	providers: [ConfigService, MailConfigService],
	exports: [ConfigService, MailConfigService],
})
export class MailConfigModule {}
