import { Module } from '@nestjs/common';
import { AuctionsModule } from 'src/models/auction/auctions.module';
import { UsersModule } from 'src/models/users/shared-user/users.module';
import { EmailModule } from 'src/providers/mail/email.module';
import { AuctionEmailsService } from './auction-emails.service';

@Module({
	imports: [EmailModule, UsersModule],
	exports: [AuctionEmailsService],
	providers: [AuctionEmailsService],
})
export class AuctionEmailsModule {}
