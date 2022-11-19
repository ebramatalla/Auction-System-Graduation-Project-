import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with cloudinary config based operations.
 *
 * @class
 */
@Injectable()
export class CloudinaryConfigService {
	constructor(private configService: ConfigService) {}

	get cloudName(): string {
		return this.configService.get<string>('cloudinary.cloudName');
	}
	get cloudApiKey(): string {
		return this.configService.get<string>('cloudinary.cloudApiKey');
	}
	get cloudApiSecret(): string {
		return this.configService.get<string>('cloudinary.cloudApiSecret');
	}
}
