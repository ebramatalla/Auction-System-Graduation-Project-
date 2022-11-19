import * as Joi from '@hapi/joi';

/**
 * Create and return a validation object for cloudinary environment variables.
 * @returns Schema of env variables
 */
export function getCloudinaryConfigValidationObj() {
	return Joi.object({
		CLOUD_NAME: Joi.string(),
		API_KEY: Joi.string().required(),
		API_SECRET: Joi.string().required(),
	});
}
