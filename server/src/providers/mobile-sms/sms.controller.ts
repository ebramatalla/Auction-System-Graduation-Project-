import {
	Controller,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
	Post,
	Req,
	BadRequestException,
	Body,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { GetCurrentUserData } from 'src/common/decorators';
import { UserDocument } from 'src/models/users/shared-user/schema/user.schema';
import { CheckVerificationCodeDto } from './dto/verification-code.dto';
import SmsService from './sms.service';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
	constructor(private readonly smsService: SmsService) {}

	@Post('verify-phone-number')
	async initiatePhoneNumberVerification(
		@GetCurrentUserData() user: UserDocument,
	) {
		if (user.isPhoneNumberConfirmed) {
			throw new BadRequestException('Phone number already confirmed 😑');
		}

		return this.smsService.initiatePhoneNumberVerification(
			user.name,
			user.phoneNumber,
		);
	}

	@HttpCode(HttpStatus.OK)
	@Post('check-verification-code')
	async checkVerificationCode(
		@GetCurrentUserData() user: UserDocument,
		@Body() { verificationCode }: CheckVerificationCodeDto,
	) {
		if (user.isPhoneNumberConfirmed) {
			throw new BadRequestException('Phone number already confirmed 🙂');
		}

		return this.smsService.confirmPhoneNumber(
			user._id.toString(),
			user.phoneNumber,
			verificationCode,
		);
	}
}
