import * as Joi from '@hapi/joi';

/**
 * Create and return a validation object for mail environment variables.
 * @returns Schema of env variables
 */
export function getMailConfigValidationObj() {
	return Joi.object({
		EMAIL_HOST: Joi.string().default('smtp.gmail.com'),
		EMAIL_SERVICE: Joi.string().required(),
		EMAIL_USER: Joi.string().required(),
		EMAIL_PASSWORD: Joi.string().required(),
	});
}
