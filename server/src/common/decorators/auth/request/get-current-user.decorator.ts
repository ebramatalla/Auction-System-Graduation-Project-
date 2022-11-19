import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/models/users/shared-user/schema/user.schema';

/*
 ? This is a param decorator that extract the user object and return it.
 */

export const GetCurrentUserData = createParamDecorator(
	(data: string | undefined, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest();
		const user: UserDocument = req.user;

		//? The user object is attached to the request from passport strategy.
		if (!data) return user; // ***Check Rt Strategy***

		return user[data]; //* like user['_id']
	},
);
