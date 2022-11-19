import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/models/auth/auth.service';

/**
 * Extract the access-token from the socket io client
 * Search for the user
 * Attach the user object into the client object
 * always pass the request
 */

@Injectable()
export class SocketAuthGuard implements CanActivate {
	//* Inject auth service
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		//* Get socket io client
		const client = context.switchToWs().getClient();

		//* Get the access token from client
		const accessToken = await this.authService.getJWTTokenFromSocketClient(
			client,
		);

		//? If no access token found
		if (!accessToken) {
			return false;
		}

		//* Get the user
		const user = await this.authService.getUserFromJWT(accessToken); //* The user may be null (expired token)

		//? Ensure that the user exists
		if (user) {
			//* Attach the user to the client object to be accessed via get user from socket decorator
			client.user = user;

			return true;
		}

		// If no user exists
		return false;
	}
}
