import * as Joi from '@hapi/joi';

/**
 * Create and return a validation object for app environment variables.
 * @returns Schema of env variables
 */
export function getAppConfigValidationObj() {
	return Joi.object({
		APP_NAME: Joi.string().default('Online Auction System'),
		APP_ENV: Joi.string()
			.valid('development', 'production', 'test', 'provision')
			.default('development'),
		APP_URL: Joi.string().default('http://localhost:8000'),
		APP_PORT: Joi.number().default(8000),
	});
}
