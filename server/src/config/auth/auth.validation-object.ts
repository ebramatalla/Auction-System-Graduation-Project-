import * as Joi from '@hapi/joi';

/**
 * Create and return a validation object for auth environment variables.
 * @returns Schema of env variables
 */
export function getAuthConfigValidationObj() {
	return Joi.object({
		//? Local login
		ACCESS_TOKEN_SECRET: Joi.string().required(),
		ACCESS_TOKEN_EXPIRATION: Joi.string().default('900s').required(),
		REFRESH_TOKEN_SECRET: Joi.string().required(),
		REFRESH_TOKEN_EXPIRATION: Joi.string().default('7d').required(),

		//? Google Login
		GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
		GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),

		//? Confirm Email
		JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
		JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
		EMAIL_CONFIRMATION_URL: Joi.string().required(),
	});
}
