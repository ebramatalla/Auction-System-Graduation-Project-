import { registerAs } from '@nestjs/config';
export default registerAs('auth', () => ({
	//? Authentication
	accessToken: process.env.ACCESS_TOKEN_SECRET,
	accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION,
	refreshToken: process.env.REFRESH_TOKEN_SECRET,
	refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION,

	//? Google login
	googleClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,

	//? Email Confirmation
	jwtVerificationTokenSecret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
	jwtVerificationTokenExpirationTime:
		process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
	emailConfirmationUrl: process.env.EMAIL_CONFIRMATION_URL,
}));
