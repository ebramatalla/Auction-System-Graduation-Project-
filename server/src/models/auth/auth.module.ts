import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthConfigModule } from 'src/config/auth/auth.config.module';
import { EmailAuthModule } from 'src/providers/mail/email-auth/verification/email-auth.module';
import { CloudinaryModule } from 'src/providers/files-upload/cloudinary.module';
import { WalletModule } from 'src/providers/payment/wallet.module';
import { UsersModule } from '../users/shared-user/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
	imports: [
		AuthConfigModule,
		UsersModule,
		PassportModule,
		EmailAuthModule,
		WalletModule,
		JwtModule.register({}),
		CloudinaryModule,
		NestjsFormDataModule,
	],
	controllers: [AuthController],
	providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
	exports: [AuthService],
})
export class AuthModule {}
