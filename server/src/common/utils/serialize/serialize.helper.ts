import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
	// eslint-disable-next-line @typescript-eslint/ban-types
	new (...args: any[]): {};
}

/**
 * Serialize ant object based on given dto (props must have @Expose/@Exclude decorators)
 * @param dto
 * @param target
 * @returns
 */
export function SerializeIt(dto: ClassConstructor, target: any) {
	return plainToInstance(dto, target, {
		excludeExtraneousValues: true,
	});
}
