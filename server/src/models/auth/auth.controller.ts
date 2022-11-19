import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
	LoginUserDto,
	RegisterUserDto,
	ResetPasswordDto,
	ResetPasswordRequestDto,
} from './dto';
import { AuthService } from './auth.service';
import {
	GetCurrentUserData,
	GetRefreshToken,
	IsPublicRoute,
} from 'src/common/decorators';
import { RefreshTokenAuthGuard } from '../../common/guards';
import { TokensAndRole } from './types';
import { Serialize } from 'src/common/interceptors';
import { UserDto } from '../users/shared-user/dto';
import { FormDataRequest } from 'nestjs-form-data';
import { EmailAuthService } from 'src/providers/mail';

/**
 * These endpoints responsible for user authentication
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private readonly emailAuthService: EmailAuthService,
	) {}

	/**
	 * Register a new user
	 * @param registerUserDto :RegisterUserDto
	 * @returns Tokens object containing access_token and refresh_token
	 */
	@IsPublicRoute()
	@HttpCode(HttpStatus.CREATED)
	@FormDataRequest() // Comes from NestjsFormDataModule (Used to upload files)
	@Post('register')
	async register(
		@Body() registerUserDto: RegisterUserDto,
	): Promise<TokensAndRole> {
		//? Register the user
		const tokens = await this.authService.register(registerUserDto);

		//? Send confirmation email
		await this.emailAuthService.sendVerificationCode(
			registerUserDto.name,
			registerUserDto.email,
		);

		return tokens;
	}

	/**
	 * Login user with email and password
	 * @param loginDto :LoginDto
	 * @returns Tokens object containing access_token and refresh_token
	 */
	@IsPublicRoute()
	@ApiBody({})
	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() loginDto: LoginUserDto): Promise<TokensAndRole> {
		return this.authService.login(loginDto);
	}

	@IsPublicRoute()
	@ApiBody({})
	@HttpCode(HttpStatus.OK)
	@Post('reset-password')
	async resetPasswordRequest(@Body() { email }: ResetPasswordRequestDto) {
		return this.authService.resetPasswordRequest(email);
	}

	@IsPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Patch('reset-password')
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.authService.resetPassword(resetPasswordDto);
	}

	/**
	 * Get the current logged in user data
	 * @param req
	 * @returns
	 */
	@ApiHeader({ name: 'Authorization' })
	@HttpCode(HttpStatus.OK)
	@Serialize(UserDto)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	/**
	 * Logout user
	 */
	@HttpCode(HttpStatus.OK)
	@Post('logout')
	logout(@GetCurrentUserData('_id') userId: string) {
		return this.authService.logout(userId);
	}

	/*
  ?  Issue new tokens if the given refresh-token is valid
  */
	@IsPublicRoute() //* Bypass AccessTokenAuthGuard
	@UseGuards(RefreshTokenAuthGuard) //* Ensure that the refresh token is exists
	@HttpCode(HttpStatus.OK)
	@ApiHeader({ name: 'authorization', description: 'Refresh Token' })
	@Post('refresh-token')
	refreshToken(
		@GetCurrentUserData('_id') userId: string,
		@GetRefreshToken() refreshToken: string,
	) {
		return this.authService.getNewRefreshToken(userId, refreshToken);
	}
}
