import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/models/users/shared-user/enums';
import { ROLES_KEY } from '../../decorators';

/*
 ? This guard ensure that the user has the required roles for any route.
 */

@Injectable()
export class HasRoleGuard implements CanActivate {
	//* Inject Reflector helper class
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		/* 
    Get the required roles to run the route handler, 
    by extract them from the metadata add by Roles decorators
    */
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		//? If no roles are specified for that route, bypass the guard
		if (!requiredRoles) return true;

		//* Get the user instance from the request (added from AT strategy)
		const { user } = context.switchToHttp().getRequest();

		//* Check if the user has the role required.
		// The some() method tests whether at least one element in the array passes the test implemented by the provided function
		const hasRole: boolean = requiredRoles.some(role => user.role === role);

		if (!hasRole)
			throw new ForbiddenException(
				'You do not have permission to perform this action 👀❌',
			);

		return true;
	}
}
