import { Module } from '@nestjs/common';
import { CloudinaryConfigModule } from 'src/config/cloudinary/cloudinary.config.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
	imports: [CloudinaryConfigModule],
	providers: [CloudinaryProvider, CloudinaryService],
	exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
