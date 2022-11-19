import { Module } from '@nestjs/common';
import { MailConfigModule } from 'src/config/mail/mail.config.module';
import EmailService from './email.service';

@Module({
	imports: [MailConfigModule],
	controllers: [],
	providers: [EmailService],
	exports: [EmailService],
})
export class EmailModule {}
