import { registerAs } from '@nestjs/config';
export default registerAs('mongo', () => ({
	connectionString: process.env.DATABASE_CONNECTION_STRING,
}));
