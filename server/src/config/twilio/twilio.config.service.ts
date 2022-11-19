import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with Twilio config based operations.
 *
 * @class
 */
@Injectable()
export class TwilioConfigService {
	constructor(private configService: ConfigService) {}

	get twilioAccountSId(): string {
		return this.configService.get<string>('twilio.twilioAccountSId');
	}
	get twilioAuthToken(): string {
		return this.configService.get<string>('twilio.twilioAuthToken');
	}
	get twilioServiceSID(): string {
		return this.configService.get<string>('twilio.twilioServiceSID');
	}
}
