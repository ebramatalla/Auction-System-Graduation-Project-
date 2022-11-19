import { registerAs } from '@nestjs/config';
export default registerAs('stripe', () => ({
	stripeSecretKey: process.env.STRIPE_SECRET_KEY,
	stripeCurrency: process.env.STRIPE_CURRENCY,
	frontendUrl: process.env.FRONTEND_URL,
}));
