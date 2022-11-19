import { Role } from 'src/models/users/shared-user/enums';

export type TokensAndRole = {
	accessToken: string;
	refreshToken: string;
	role: Role;
};
