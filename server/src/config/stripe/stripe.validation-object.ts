import * as Joi from '@hapi/joi';

/**
 * Create and return a validation object for app environment variables.
 * @returns Schema of env variables
 */
export function getStripeConfigValidationObj() {
	return Joi.object({
		STRIPE_SECRET_KEY: Joi.string(),
		STRIPE_CURRENCY: Joi.string(),
		FRONTEND_URL: Joi.string(),
	});
}
