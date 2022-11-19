import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IsPublicRoute } from 'src/common/decorators';
import { ConfirmVerificationCodeDto, ResendVerificationCodeDto } from './dto';
import { EmailAuthService } from './email-auth.service';

@Controller()
export class EmailAuthController {
	constructor(private readonly emailAuthService: EmailAuthService) {}

	@IsPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post('email-confirmation/confirm')
	async confirm(
		@Body() { verificationCode, email }: ConfirmVerificationCodeDto,
	) {
		//* Confirm the email
		return await this.emailAuthService.confirmEmailVerificationCode(
			email,
			verificationCode,
		);
	}

	@IsPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post('email-confirmation/resend-confirmation-link')
	async resendConfirmationCode(@Body() { email }: ResendVerificationCodeDto) {
		return await this.emailAuthService.resendConfirmationCode(email);
	}

	/*-------------------*/
	@IsPublicRoute()
	@HttpCode(HttpStatus.OK)
	@Post('reset-password/confirm-code')
	async confirmResetPasswordCode(
		@Body() { verificationCode, email }: ConfirmVerificationCodeDto,
	) {
		//* Confirm reset password code
		return await this.emailAuthService.confirmResetPasswordCode(
			email,
			verificationCode,
		);
	}
}
