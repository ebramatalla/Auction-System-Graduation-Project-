import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with stripe config based operations.
 *
 * @class
 */
@Injectable()
export class StripeConfigService {
	constructor(private configService: ConfigService) {}

	get stripeSecretKey(): string {
		return this.configService.get<string>('stripe.stripeSecretKey');
	}
	get stripeCurrency(): string {
		return this.configService.get<string>('stripe.stripeCurrency');
	}
	get frontendUrl(): string {
		return this.configService.get<string>('stripe.frontendUrl');
	}
}
