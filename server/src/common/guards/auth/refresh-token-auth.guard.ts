import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
 ? This guard is used to ensure that the user passed the refresh-token.
*/

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard('jwt-refresh') {}
