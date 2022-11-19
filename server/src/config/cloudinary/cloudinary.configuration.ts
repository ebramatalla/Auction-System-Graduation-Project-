import { registerAs } from '@nestjs/config';
export default registerAs('cloudinary', () => ({
	cloudName: process.env.CLOUD_NAME,
	cloudApiKey: process.env.API_KEY,
	cloudApiSecret: process.env.API_SECRET,
}));
