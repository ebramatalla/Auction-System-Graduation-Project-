import { StripeController as WalletController } from './wallet.controller';
import { Module } from '@nestjs/common';
import { StripeConfigModule } from 'src/config/stripe/stripe.config.module';
import WalletService from './wallet.service';
import { Wallet, WalletSchema } from './schema/wallet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema';
import TransactionService from './transaction.service';

@Module({
	imports: [
		StripeConfigModule,
		MongooseModule.forFeatureAsync([
			{
				name: Wallet.name,
				useFactory: () => {
					const schema = WalletSchema;
					//? Add the auto-populate plugin
					schema.plugin(require('mongoose-autopopulate'));
					return schema;
				},
			},
		]),
		MongooseModule.forFeatureAsync([
			{
				name: Transaction.name,
				useFactory: () => {
					const schema = TransactionSchema;
					//? Add the auto-populate plugin
					schema.plugin(require('mongoose-autopopulate'));
					return schema;
				},
			},
		]),
	],
	controllers: [WalletController],
	providers: [WalletService, TransactionService],
	exports: [WalletService, TransactionService],
})
export class WalletModule {}
