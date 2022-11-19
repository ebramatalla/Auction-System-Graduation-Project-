/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExposeOptions, Transform, TransformFnParams } from 'class-transformer';

/*
 ? This decorator used to handle ObjectId issue(new one on every request). 
 */

export const ExposeObjectId =
	(_options?: ExposeOptions) => (target: Object, propertyKey: string) => {
		Transform((params: TransformFnParams) => params.obj[propertyKey])(
			target,
			propertyKey,
		);
	};
