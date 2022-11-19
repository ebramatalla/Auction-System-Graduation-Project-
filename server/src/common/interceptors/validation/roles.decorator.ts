import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/models/users/shared-user/enums';

/*
 ? This will change the metadata to add given role to the route
 */

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
