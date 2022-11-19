import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfigService } from 'src/config/auth/auth.config.service';
import { UsersService } from 'src/models/users/shared-user/users.service';
import { JwtPayload } from '../types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authConfigService: AuthConfigService,
		private readonly usersService: UsersService,
	) {
		//? Setup JWT Options
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: authConfigService.accessTokenSecret,
		});
	}

	/**
	 * The return value of this method will be assigned to req.user
	 * @param payload :JwtPayload
	 * @returns user instance
	 */
	async validate({ sub }: JwtPayload) {
		const user = await this.usersService.findById(sub);
		if (!user) throw new ForbiddenException('Access Denied ❌');

		return user;
	}
}
