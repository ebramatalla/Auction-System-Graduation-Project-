import * as Joi from '@hapi/joi';

/**
 * Create and return a validation object for twilio environment variables.
 * @returns Schema of env variables
 */
export function getTwilioConfigValidationObj() {
	return Joi.object({
		TWILIO_ACCOUNT_SID: Joi.string(),
		TWILIO_AUTH_TOKEN: Joi.string().required(),
		TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
	});
}
