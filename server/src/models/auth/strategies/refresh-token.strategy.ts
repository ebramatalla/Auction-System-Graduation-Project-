import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfigService } from 'src/config/auth/auth.config.service';
import { UserDocument } from 'src/models/users/shared-user/schema/user.schema';
import { UsersService } from 'src/models/users/shared-user/users.service';
import { JwtPayload } from '../types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(
		private readonly authConfigService: AuthConfigService,
		private usersService: UsersService,
	) {
		//? Setup JWT Options
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfigService.refreshTokenSecret,
		});
	}

	/**
	 * The return value of this method will be assigned to req.user
	 * @param payload :JwtPayload
	 * @returns user instance
	 */
	async validate(payload: JwtPayload): Promise<UserDocument> {
		const user: UserDocument = await this.usersService.findById(payload.sub);
		if (!user) throw new ForbiddenException('Access Denied ❌');

		return user;
	}
}
