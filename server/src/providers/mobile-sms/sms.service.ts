import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TwilioConfigService } from 'src/config/twilio/twilio.config.service';
import { UsersService } from 'src/models/users/shared-user/users.service';
import { Twilio } from 'twilio';

@Injectable()
export default class SmsService {
	private logger: Logger = new Logger(SmsService.name);
	private twilioClient: Twilio;

	constructor(
		private readonly twilioConfigService: TwilioConfigService,
		private readonly usersService: UsersService,
	) {
		const accountSid = twilioConfigService.twilioAccountSId;
		const authToken = twilioConfigService.twilioAuthToken;

		this.twilioClient = new Twilio(accountSid, authToken);
	}

	/**
	 * Initiating the SMS verification
	 * @param phoneNumber - user phone number
	 * @returns
	 */
	async initiatePhoneNumberVerification(username: string, phoneNumber: string) {
		this.logger.debug(`Initiating SMS verification for ${phoneNumber}`);

		const serviceSid = this.twilioConfigService.twilioServiceSID;

		try {
			await this.twilioClient.verify.services(serviceSid).verifications.create({
				to: phoneNumber,
				channel: 'sms',
				locale: 'en',
				// customMessage: `Hey ${username}😃👋🏻, verify your phone number using the following code`,
			});

			return {
				success: true,
				message:
					'Mobile verification code sent successfully to you phone number 😃',
			};
		} catch (error) {
			this.logger.error({ error });

			return {
				success: false,
				message: 'Cannot sent mobile OTP right now 😢',
			};
		}
	}

	/**
	 * Confirm user's phone number
	 * @param userId - user id
	 * @param phoneNumber - user phone number
	 * @param verificationCode -	verification code
	 */
	async confirmPhoneNumber(
		userId: string,
		phoneNumber: string,
		verificationCode: string,
	) {
		this.logger.debug(`Confirming phone number for ${phoneNumber}`);
		const serviceSid = this.twilioConfigService.twilioServiceSID;

		try {
			const result = await this.twilioClient.verify
				.services(serviceSid)
				.verificationChecks.create({ to: phoneNumber, code: verificationCode });

			if (!result.valid || result.status !== 'approved') {
				throw new BadRequestException(
					'Invalid OTP or expired, please try again 🙂',
				);
			}

			const isMarked = await this.usersService.markPhoneNumberAsConfirmed(
				userId,
			);

			if (!isMarked) {
				throw new BadRequestException('Cannot confirm your phone number 😢');
			}

			return {
				success: true,
				message: 'Your phone number has been confirmed 🎉',
			};
		} catch (error) {
			throw new BadRequestException(
				'Invalid OTP or expired, please try again 🙂',
			);
		}
	}
}
