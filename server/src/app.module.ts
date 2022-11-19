import { SmsModule } from './providers/mobile-sms/sms.module';
import { SocketModule } from './providers/socket/socket.module';
import { WalletModule } from './providers/payment/wallet.module';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EmailSchedulingService } from './providers/schedule/mail/email-scheduling.service';
import { AuthModule } from './models/auth/auth.module';
import { EmailModule } from './providers/mail/email.module';
import { EmailAuthModule } from './providers/mail/email-auth/verification/email-auth.module';
import { ChatModule } from './models/chat/chat.module';
import { CategoryModule } from './models/category/category.module';
import { ItemModule } from './models/items/item.module';
import { SchemaModule } from './models/users/shared-user/schema/schema.module';
import { SellerModule } from './models/users/seller/seller.module';
import { AccessTokenAuthGuard, HasRoleGuard } from './common/guards';
import { AuctionsModule } from './models/auction/auctions.module';
import { LogsMiddleware as HttpRequestsLogsMiddleware } from './common/middlewares';
import { AppConfigModule } from './config/app/app.config.module';
import { MongoConfigModule } from './config/database/mongo.config.module';
import { AuthConfigModule } from './config/auth/auth.config.module';
import { MongoDatabaseProviderModule } from './providers/database/mongo/mongo.module';
import { UsersModule } from './models/users/shared-user/users.module';
import { AdminModule } from './models/users/admin/admin.module';
import { BuyerModule } from './models/users/buyer/buyer.module';
import { EmployeeModule } from './models/users/employee/employee.module';
import { StripeConfigModule } from './config/stripe/stripe.config.module';
import { AuctionSchedulingService } from './providers/schedule/auction/auction-scheduling.service';
import { BidModule } from './models/bids/bid.module';
import { AuctionEmailsModule } from './providers/mail/email-auction/auction-emails.module';

@Module({
	imports: [
		//? Import sms module
		SmsModule,

		SocketModule,
		//? Import stripe module
		WalletModule,
		//? Import the chat module
		ChatModule,
		//? Import the bid module
		BidModule,
		//? Import category and item modules
		CategoryModule,
		ItemModule,

		//? Load all user related modules
		SchemaModule,
		AdminModule,
		EmployeeModule,
		SellerModule,
		BuyerModule,

		//? All environment variables Loader Modules.
		AppConfigModule,
		MongoConfigModule,
		AuthConfigModule,
		StripeConfigModule,

		//? Setup Database
		MongoDatabaseProviderModule,

		//? Main Modules
		UsersModule,
		AuthModule,
		AuctionsModule,

		//? Email module
		EmailModule,
		EmailAuthModule,
		AuctionEmailsModule,
		/*
		? Enable task schedule
		 * The ScheduleModule.forRoot method initializes the scheduler.
		 * It also registers all the cron jobs we define declaratively across our application.
		 */
		ScheduleModule.forRoot(),
	],
	providers: [
		EmailSchedulingService,
		AuctionSchedulingService,
		//? Enable AccessTokenAuthGuard on all routes (Some routes will use IsPublicRoute to bypass authentication)
		{
			provide: APP_GUARD,
			useClass: AccessTokenAuthGuard,
		},
		//? Enable HasRoleGuard on all routes to check whether the user has the required role to access the endpoint or not
		{
			provide: APP_GUARD,
			useClass: HasRoleGuard,
		},
	],
})
export class AppModule {
	//? Configure the application middleware
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(HttpRequestsLogsMiddleware).forRoutes('*');
	}
}
