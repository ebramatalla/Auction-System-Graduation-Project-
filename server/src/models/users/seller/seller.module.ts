import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';

import { forwardRef, Module } from '@nestjs/common';
import { AuctionsModule } from 'src/models/auction/auctions.module';
import { CloudinaryModule } from 'src/providers/files-upload/cloudinary.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ComplaintModule } from 'src/models/complaint/complaint.module';
import { ReviewModule } from 'src/models/review/review.module';

@Module({
	imports: [
		//? Import Nestjs form data handler middleware
		NestjsFormDataModule,
		forwardRef(() => AuctionsModule),
		CloudinaryModule,
		ComplaintModule,
		forwardRef(() => ReviewModule),
	],
	controllers: [SellerController],
	providers: [SellerService],
	exports: [SellerService],
})
export class SellerModule {}
