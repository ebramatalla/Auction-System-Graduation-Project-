import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/models/category/category.module';
import { EmployeeModule } from '../employee/employee.module';
import { AuctionsModule } from 'src/models/auction/auctions.module';
import { UsersModule } from '../shared-user/users.module';
import { ComplaintModule } from 'src/models/complaint/complaint.module';
import { AuctionEmailsModule } from 'src/providers/mail/email-auction/auction-emails.module';
import { CloudinaryModule } from 'src/providers/files-upload/cloudinary.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		UsersModule,
		AuctionsModule,
		EmployeeModule,
		CategoryModule,
		CloudinaryModule,
		NestjsFormDataModule,
		ComplaintModule,
		AuctionEmailsModule,
	],
	controllers: [AdminController],
	providers: [AdminService],
})
export class AdminModule {}
