import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AuthConfigService {
	constructor(private configService: ConfigService) {}

	//? Local authentication environment variables.
	get accessTokenSecret(): string {
		return this.configService.get<string>('auth.accessToken');
	}

	get accessTokenExpiration(): number {
		return Number(this.configService.get<number>('auth.accessTokenExpiration'));
	}

	get refreshTokenSecret(): string {
		return this.configService.get<string>('auth.refreshToken');
	}

	get refreshTokenExpiration(): number {
		return Number(
			this.configService.get<number>('auth.refreshTokenExpiration'),
		);
	}

	//? Google auth environment variables.
	get googleClientId(): string {
		return this.configService.get<string>('auth.googleClientId');
	}

	get googleClientSecret(): string {
		return this.configService.get<string>('auth.googleClientSecret');
	}

	//? Confirm Email environment variables.
	get jwtVerificationTokenSecret(): string {
		return this.configService.get<string>('auth.jwtVerificationTokenSecret');
	}

	get jwtVerificationTokenExpirationTime(): string {
		return this.configService.get<string>(
			'auth.jwtVerificationTokenExpirationTime',
		);
	}

	get emailConfirmationUrl(): string {
		return this.configService.get<string>('auth.emailConfirmationUrl');
	}
}
