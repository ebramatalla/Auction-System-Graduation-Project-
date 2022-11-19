import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with mail config based operations.
 *
 * @class
 */
@Injectable()
export class MailConfigService {
	constructor(private configService: ConfigService) {}

	get host(): string {
		return this.configService.get<string>('mail.host');
	}
	get service(): string {
		return this.configService.get<string>('mail.service');
	}
	get user(): string {
		return this.configService.get<string>('mail.user');
	}
	get password(): string {
		return this.configService.get<string>('mail.password');
	}
}
