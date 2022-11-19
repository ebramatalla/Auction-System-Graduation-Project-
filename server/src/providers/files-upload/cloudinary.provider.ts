import { v2 } from 'cloudinary';
import { CloudinaryConfigModule } from 'src/config/cloudinary/cloudinary.config.module';
import { CloudinaryConfigService } from 'src/config/cloudinary/cloudinary.config.service';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
	provide: CLOUDINARY,
	//* Inject cloudinaryConfigService to get cloudinary environment variables
	imports: [CloudinaryConfigModule],
	useFactory: (cloudinaryConfigService: CloudinaryConfigService) => {
		return v2.config({
			cloud_name: cloudinaryConfigService.cloudName,
			api_key: cloudinaryConfigService.cloudApiKey,
			api_secret: cloudinaryConfigService.cloudApiSecret,
		});
	},
	inject: [CloudinaryConfigService],
};
