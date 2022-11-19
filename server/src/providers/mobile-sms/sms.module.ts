import { Module } from '@nestjs/common';
import { TwilioConfigModule } from 'src/config/twilio/twilio.config.module';
import { UsersModule } from 'src/models/users/shared-user/users.module';
import SmsController from './sms.controller';
import SmsService from './sms.service';

@Module({
	imports: [UsersModule, TwilioConfigModule],
	controllers: [SmsController],
	providers: [SmsService],
	exports: [SmsService],
})
export class SmsModule {}
