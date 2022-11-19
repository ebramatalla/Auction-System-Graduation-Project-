import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './stripe.configuration';
import { StripeConfigService } from './stripe.config.service';
import { getStripeConfigValidationObj } from './stripe.validation-object';
/**
 * Import and provide stripe configuration related classes.
 *
 * @module
 */
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.development.env',
			load: [configuration],
			validationSchema: getStripeConfigValidationObj(),
		}),
	],
	providers: [ConfigService, StripeConfigService],
	exports: [ConfigService, StripeConfigService],
})
export class StripeConfigModule {}
