import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/shared-user/users.service';
import { JwtPayload } from './types/jwt-payload.type';
import { compare, hash } from 'bcryptjs';
import { LoginUserDto, RegisterUserDto, ResetPasswordDto } from '../auth/dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokensAndRole } from './types';
import { AuthConfigService } from 'src/config/auth/auth.config.service';
import { User, UserDocument } from '../users/shared-user/schema/user.schema';
import { Socket } from 'socket.io';
import WalletService from 'src/providers/payment/wallet.service';
import { Seller, SellerDocument } from '../users/seller/schema/seller.schema';
import { Buyer, BuyerDocument } from '../users/buyer/schema/buyer.schema';
import { AvailableRolesForRegister } from '../users/shared-user/enums';
import { CloudinaryService } from 'src/providers/files-upload/cloudinary.service';
import { ImageType } from 'src/common/types';
import { EmailAuthService } from 'src/providers/mail';

@Injectable()
export class AuthService {
	constructor(
		// Inject all Models (User, buyer and seller)
		@InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
		@InjectModel(Seller.name)
		private readonly sellerModel: Model<SellerDocument>,
		@InjectModel(Buyer.name)
		private readonly buyerModel: Model<BuyerDocument>,
		private readonly emailAuthService: EmailAuthService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly authConfigService: AuthConfigService,
		private readonly walletService: WalletService,
		private cloudinary: CloudinaryService,
	) {}

	private logger: Logger = new Logger('AuthService');

	/**
	 * Register new user
	 * @param registerUserDto
	 * @returns Tokens: Object of access_token and refresh_token
	 */
	async register(registerUserDto: RegisterUserDto): Promise<TokensAndRole> {
		//* Ensure that the given email is not taken
		const isTaken = await this.usersService.findByEmail(registerUserDto.email);
		if (isTaken) throw new BadRequestException('Email already taken ❌👀');

		//? Create stripe customer instance for the user
		const stripeCustomer = await this.walletService.createCustomer(
			registerUserDto.name,
			registerUserDto.email,
			registerUserDto.role,
		);

		//* Upload image to cloudinary
		let image: ImageType;
		if (registerUserDto.image) {
			this.logger.debug('Uploading user image to cloudinary...');
			try {
				// Upload image to cloudinary
				const savedImage = await this.cloudinary.uploadImage(
					registerUserDto.image,
				);

				//* If upload success, save image url and public id to db
				if (savedImage.url) {
					this.logger.log('User image uploaded to cloudinary successfully ✔✔');
					image = new ImageType(savedImage.url, savedImage.public_id);
				}
			} catch (error) {
				this.logger.error('Unable to upload image to cloudinary');
				throw new BadRequestException(
					'Cannot upload image to cloudinary, ',
					error,
				);
			}
		}

		//? Check whether the user is buyer or seller
		let createdUser;
		if (registerUserDto.role === AvailableRolesForRegister.Buyer) {
			//? Create new buyer instance
			createdUser = new this.buyerModel({
				...registerUserDto,
				stripeCustomerId: stripeCustomer.id,
				image,
			});

			//? Create new wallet to the seller
			await this.walletService.createWallet(createdUser);
		} else {
			//? Create new buyer instance
			createdUser = new this.sellerModel({
				...registerUserDto,
				stripeCustomerId: stripeCustomer.id,
				image,
			});

			//? Create new wallet to the buyer
			await this.walletService.createWallet(createdUser);
		}

		//? Issue tokens, save refresh_token in db and save user
		const tokens = await this.getTokensAndSaveUser(createdUser);

		//* Return the tokens to the user
		return tokens;
	}

	/**
	 * Validate user credentials
	 * @param loginDto {email, password}: LoginDto
	 * @returns Tokens object contains access_token and refresh_token
	 */
	async login({ email, password }: LoginUserDto): Promise<TokensAndRole> {
		//* Find the user
		const user: UserDocument = await this.usersService.findByEmail(email);
		if (!user) throw new NotFoundException('Invalid username or password ❌');

		//* Check if the user is blocked or not
		if (user.isBlocked) {
			throw new UnauthorizedException(
				`[BLOCKED ACCOUNT] ==> ${user.blockReason}`,
			);
		}

		//? Check if the password matches or not
		const isMatch = await compare(password, user.password);
		if (!isMatch)
			throw new NotFoundException('Invalid username or password ❌');

		//? Issue tokens, save refresh_token in db and save user
		const tokens = await this.getTokensAndSaveUser(user);

		return tokens;
	}

	/**
	 * Find for the user by email and send the reset password link
	 * @param email - user email
	 */
	async resetPasswordRequest(email: string) {
		//* Find the user
		const user: UserDocument = await this.usersService.findByEmail(email);
		if (!user) {
			return {
				success: false,
				message:
					'If there is an account associated with that email, we will send you a link to reset your password.',
			};
		}

		//* Send reset password link to the user
		const result = await this.emailAuthService.sendResetPasswordCode(
			user.name,
			user.email,
		);

		if (!result)
			throw new NotFoundException('Unable to reset password right now 😑');

		return {
			success: true,
			message:
				'If there is an account associated with that email, we will send you a link to reset your password.',
		};
	}

	/**
	 * Reset user's password
	 * @param resetPasswordDto
	 */
	async resetPassword({
		email,
		verificationCode,
		password: newPassword,
	}: ResetPasswordDto) {
		//* Find the user by email and verification code and update the password
		const isReset: boolean = await this.usersService.resetUserPassword(
			email,
			verificationCode,
			newPassword,
		);

		if (!isReset) {
			throw new NotFoundException(
				'Unable to reset password of your account 😑',
			);
		}

		return {
			success: true,
			message: 'Your password has been reset successfully 💙',
		};
	}

	/**
	 * Logout user
	 * @param _id - User id
	 */
	async logout(_id: string) {
		/*
   ? Find the user and set the refresh_token to null
   */
		await this.usersModel.findByIdAndUpdate(
			_id,
			{ refreshToken: null },
			{ new: true },
		);
	}

	/**
	 * Issue new tokens if the given refresh-token is valid
	 * @param _id - User id
	 * @param refreshToken - Given refresh-token
	 * @returns Tokens object contains access_token and refresh_token
	 */
	async getNewRefreshToken(
		_id: string,
		refreshToken: string,
	): Promise<TokensAndRole> {
		const user = await this.usersService.findById(_id);

		if (!user || !user.refreshToken)
			throw new ForbiddenException('Access Denied ❌');

		const isMatch = await compare(refreshToken, user.refreshToken);
		if (!isMatch) throw new ForbiddenException('Access Denied ❌');

		//? Issue tokens, save refresh_token in db and save user
		const tokens = await this.getTokensAndSaveUser(user);

		return tokens;
	}

	/* Utility functions */

	/**
	 * Issue new jwt token contains some user info for access_token and refresh_token
	 * @param Object contains userId (sub) and email
	 * @returns Object contains access_token and refreshToken
	 */
	async getJWTTokens({ sub, email }): Promise<TokensAndRole> {
		//? Prepare the payload
		const payload: JwtPayload = { sub, email };

		//? Issue new accessToken, refreshToken
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.sign(payload, {
				secret: this.authConfigService.accessTokenSecret,
				expiresIn: this.authConfigService.accessTokenExpiration,
			}),

			this.jwtService.sign(payload, {
				secret: this.authConfigService.refreshTokenSecret,
				expiresIn: this.authConfigService.refreshTokenExpiration,
			}),
		]);

		return { accessToken, refreshToken, role: null };
	}

	async updateRefreshToken(user: UserDocument, refreshToken: string) {
		const hashedToken = await this.hashData(refreshToken);
		user.refreshToken = hashedToken;
	}

	/**
	 * Hash any string
	 * @param data
	 * @returns hashed data
	 */
	async hashData(data: string) {
		return hash(data, 12);
	}

	/**
	 * Issue new tokens and save refresh_token in db and save user instance
	 * @param user - User instance
	 * @returns Tokens object contains access_token and refresh_token
	 */
	async getTokensAndSaveUser(user: UserDocument): Promise<TokensAndRole> {
		//? Issue jwt tokens
		const tokens: TokensAndRole = await this.getJWTTokens({
			sub: user._id,
			email: user.email,
		});

		//? Save the refreshToken in the db
		await this.updateRefreshToken(user, tokens.refreshToken);

		//* Save the user instance
		await user.save();

		//* Append user role to the token
		tokens.role = user.role;

		return tokens;
	}

	/**
	 * Accept socket client and return access token
	 * @param client
	 * @returns access token if found
	 */
	async getJWTTokenFromSocketClient(client: Socket) {
		//* Extract the headers
		const handshakeHeaders = client.handshake.headers;

		//* Extract the access token
		let accessToken = handshakeHeaders.authorization;

		if (!accessToken) {
			return false;
		}

		// Extract the access token
		accessToken = accessToken.replace('Bearer', '').trim();

		return accessToken;
	}

	/**
	 * Get the user who owns the access token
	 * @param accessToken user access token
	 */
	async getUserFromJWT(accessToken: string): Promise<UserDocument> {
		/*
		 * First verify the token.
		 * Then, search for the user
		 * Finally, return the user
		 */
		try {
			//* verify token
			const payload: JwtPayload = await this.jwtService.verifyAsync(
				accessToken,
				{
					// Attach access token secret
					secret: this.authConfigService.accessTokenSecret,
				},
			);
			if (!payload) return null;

			//* Search for the user
			const user = await this.usersService.findById(payload.sub);
			if (!user) return null;

			//* Return the user
			return user;
		} catch (error) {
			//* An error occurred
			this.logger.log('Expired Token...❌');
			return null;
		}
	}
}
