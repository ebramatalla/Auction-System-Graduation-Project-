import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/app.config.service';
import { AuctionSchedulingService } from './providers/schedule/auction/auction-scheduling.service';

async function bootstrap() {
	//* Create new logger
	const logger: Logger = new Logger('main.ts');

	//* Create new nest app
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	//? Enable Cross-origin resource sharing
	app.enableCors({
		origin: ['http://localhost:3000'], //* This for react app
		credentials: true,
	});

	//* Setup Global validation pipes
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	//* Setup Swagger here
	const config = new DocumentBuilder()
		.setTitle('Online Auction System 📃')
		.setDescription(
			'API description for all endpoints of Online Auction System.',
		)
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api-docs', app, document);

	//? Get app config for cors settings and starting the app.
	const appConfig: AppConfigService = app.get(AppConfigService);
	await app.listen(appConfig.port, () =>
		logger.log(`Server started on port ${appConfig.port} ⚡⚡`),
	);

	//* Re-create cron jobs for upcoming auctions

	//* Inject AuctionSchedulingService
	const auctionSchedulingService: AuctionSchedulingService = app.get(
		AuctionSchedulingService,
	);

	await auctionSchedulingService.loadCronJobsForAuctions();
}
bootstrap();
