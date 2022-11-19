import { registerAs } from '@nestjs/config';
export default registerAs('twilio', () => ({
	twilioAccountSId: process.env.TWILIO_ACCOUNT_SID,
	twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
	twilioServiceSID: process.env.TWILIO_VERIFICATION_SERVICE_SID,
}));
