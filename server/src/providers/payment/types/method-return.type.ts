import Stripe from 'stripe';

export class SuccessOrFailType {
	success: boolean;
	message: Stripe.PaymentIntent.Status | string;
	data: {
		paymentIntentId: string;
	};
}
