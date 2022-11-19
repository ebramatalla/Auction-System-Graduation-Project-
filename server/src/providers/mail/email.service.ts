import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { MailConfigService } from 'src/config/mail/mail.config.service';

@Injectable()
export default class EmailService {
	private logger: Logger = new Logger('Email Service 📨');
	private nodemailerTransport: Mail;

	constructor(private readonly mailConfigService: MailConfigService) {
		this.nodemailerTransport = createTransport({
			service: mailConfigService.service,
			auth: {
				user: mailConfigService.user,
				pass: mailConfigService.password,
			},
		});
	}

	/**
	 * Send email with subject
	 * @param options - Mail options object
	 * @returns result of send email
	 */
	async sendMail(options: Mail.Options): Promise<boolean> {
		try {
			await this.nodemailerTransport.sendMail(options);
			this.logger.log('Email sent successfully 📨❤');
			return true;
		} catch (error) {
			console.log({ error });

			this.logger.error('Email failed to be sent!');
			return false;
		}
	}
}
