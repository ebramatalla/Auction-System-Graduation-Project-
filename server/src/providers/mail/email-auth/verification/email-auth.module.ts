import { Module } from '@nestjs/common';
import { UsersModule } from 'src/models/users/shared-user/users.module';
import { EmailModule } from 'src/providers/mail/email.module';
import { EmailAuthController } from './email-auth.controller';
import { EmailAuthService } from './email-auth.service';

@Module({
	imports: [EmailModule, UsersModule],
	controllers: [EmailAuthController],
	exports: [EmailAuthService],
	providers: [EmailAuthService],
})
export class EmailAuthModule {}
