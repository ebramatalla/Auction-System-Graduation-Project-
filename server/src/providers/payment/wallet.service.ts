import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

import { StripeConfigService } from 'src/config/stripe/stripe.config.service';
import { Buyer } from 'src/models/users/buyer/schema/buyer.schema';
import { Seller } from 'src/models/users/seller/schema/seller.schema';
import { User } from 'src/models/users/shared-user/schema/user.schema';
import Stripe from 'stripe';
import { TransactionType } from './enums';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import TransactionService from './transaction.service';
import { SuccessOrFailType } from './types/method-return.type';

/**
 * This service will interact with strip
 */

@Injectable()
export default class WalletService {
	private logger: Logger = new Logger('Wallet Service 💲🤑');
	private stripe: Stripe;

	constructor(
		@InjectModel(Wallet.name)
		private readonly walletModel: Model<WalletDocument>,
		private readonly transactionService: TransactionService,

		private stripeConfigService: StripeConfigService,
	) {
		//* Create new strip instance and provide the secret key
		this.stripe = new Stripe(stripeConfigService.stripeSecretKey, {
			apiVersion: '2020-08-27',
		});
	}

	/**
	 * Create a Stripe customer for each of our authenticated users
	 * @param name - user name
	 * @param email - user email
	 * @param role - role of the user
	 * @returns new Stripe Customer instance
	 */
	public async createCustomer(name: string, email: string, role: string) {
		this.logger.debug('Creating new strip customer for ' + email + ' 😉');
		return this.stripe.customers.create({
			name,
			email,
			description: role,
		});
		/*
		The stripe.customers.create function calls the Stripe API
		 and returns the data bout the Stripe customer.
		*/
	}

	/**
	 * Create new wallet for the user
	 * @param user - User that owns the wallet
	 * @returns created wallet instance
	 */
	public async createWallet(user: Seller | Buyer) {
		this.logger.debug('Creating new wallet for the user 😉');
		const createdWallet = new this.walletModel({ user });

		if (!createdWallet) {
			return null;
		}

		await createdWallet.save();
		this.logger.log('Wallet created successfully with id ' + createdWallet.id);

		return createdWallet;
	}

	/**
	 * List all saved wallets in the system
	 */
	listAllWallets() {
		return this.walletModel.find({});
	}

	/**
	 * Return user wallet balance
	 * @param user
	 */
	public async getWalletBalance(
		user: User | string,
	): Promise<{ balance: number }> {
		const wallet = await this.walletModel.findOne({ user });

		if (wallet == null) {
			throw new BadRequestException('Wallet not found for that user!!');
		}

		return { balance: wallet.balance };
	}

	/**
	 * Charging the user wallet
	 * @param amount - amount of money
	 * @param paymentMethodId - id sent by our frontend app after saving the credit card details
	 * @param user - user that make the charge request
	 * @returns either success of fail
	 */
	public async chargeWallet(
		amount: number,
		paymentMethodId: string,
		user: any,
	): Promise<SuccessOrFailType> {
		const successOrFailRes: SuccessOrFailType = await this.createPaymentIntent(
			amount,
			paymentMethodId,
			user.stripeCustomerId,
			user.email,
		);

		if (successOrFailRes.success === false) {
			return successOrFailRes;
		}

		//* Increment user wallet balance
		await this.updateWalletBalance(user, amount, false);

		//* Save the transaction into db
		await this.transactionService.createTransaction({
			amount,
			transactionType: TransactionType.Deposit,
			isBlockAssuranceTransaction: false,
			sender: user,
			recipient: user,
			paymentIntentId: successOrFailRes.data.paymentIntentId,
		});

		return successOrFailRes;
	}

	/**
	 * Refund money from wallet
	 * @param user - logged in user
	 * @param paymentIntentId: Transaction's paymentIntent id that will be refunded
	 */
	public async refundMoney(
		user: any,
		paymentIntentId: string,
	): Promise<SuccessOrFailType> {
		//* Get the amount of money in the transaction
		const amount = await this.transactionService.getTransactionAmount(
			paymentIntentId,
		);

		const { balance: walletBalance } = await this.getWalletBalance(
			user._id.toString(),
		);

		if (amount > walletBalance) {
			throw new BadRequestException(
				'You can not refund more than your wallet balance ❌❌',
			);
		}

		//* Create the refund on stripe
		try {
			await this.stripe.refunds.create({
				payment_intent: paymentIntentId,
				reason: 'requested_by_customer',
			});
		} catch (error) {
			this.logger.error(error);
			return {
				success: false,
				message: 'This transaction already refunded',
				data: null,
			};
		}

		//* Decrement user wallet balance
		await this.updateWalletBalance(user, amount, true);

		//* Update transaction status to be refunded
		await this.transactionService.markTransactionAsRefunded(paymentIntentId);

		//* Save the transaction into db
		await this.transactionService.createTransaction({
			amount,
			transactionType: TransactionType.Withdrawal,
			isBlockAssuranceTransaction: false,
			sender: user,
			recipient: user,
			paymentIntentId: paymentIntentId,
		});

		return {
			success: true,
			message: 'Refund done ✔✔, check your bank account 🏦',
			data: null,
		};
	}

	/**
	 * Block specific value from user wallet
	 * @param bidder
	 * @param assuranceValue
	 */
	public async blockAssuranceFromWallet(bidder: Buyer, assuranceValue: number) {
		this.logger.debug(
			`Blocking ${assuranceValue} from bidder ${bidder.name} wallet`,
		);
		//* Get bidder wallet
		const wallet = this.walletModel.findOne({ user: bidder });

		if (!wallet) {
			throw new BadRequestException('Wallet not found for that user!!');
		}

		//* Update bidder wallet balance
		await this.updateWalletBalance(bidder, assuranceValue, true);

		//* Save the transaction into db
		const transaction = await this.transactionService.createTransaction({
			amount: assuranceValue,
			transactionType: TransactionType.BlockAssurance,
			sender: bidder._id,
			recipient: null,
			isBlockAssuranceTransaction: true,
			paymentIntentId: null,
		});

		if (!transaction) {
			throw new BadRequestException('Transaction not created!!');
		}

		return true;
	}

	/**
	 * Recover assurance to bidder wallet
	 * @param bidder
	 * @param assuranceValue
	 */
	public async recoverAssuranceToBidder(bidder: Buyer, assuranceValue: number) {
		this.logger.debug(
			`Recovering ${assuranceValue} to bidder ${bidder.name} wallet...`,
		);

		//* Get bidder wallet
		const wallet = this.walletModel.findOne({ user: bidder });

		if (!wallet) {
			throw new BadRequestException('Wallet not found for that user!!');
		}

		//* Update bidder wallet balance
		await this.updateWalletBalance(bidder, assuranceValue, false);

		//* Save the transaction into db
		const transaction = await this.transactionService.createTransaction({
			amount: assuranceValue,
			transactionType: TransactionType.RecoverAssurance,
			sender: null,
			recipient: bidder._id,
			isBlockAssuranceTransaction: true,
			paymentIntentId: null,
		});

		if (!transaction) {
			throw new BadRequestException('Transaction not created!!');
		}

		return true;
	}

	/*--------------------------------*/
	//* Helper methods

	/**
	 * Create new payment intent
	 * @returns payment intent object
	 */
	private async createPaymentIntent(
		amount: number,
		paymentMethodId: string,
		stripCustomerId: string,
		customerEmail: string,
	): Promise<SuccessOrFailType> {
		try {
			//* Create new payment intent for the user.
			const paymentIntent = await this.stripe.paymentIntents.create({
				amount: amount * 100, // Amount to charge (Multiple by 100 to convert from cent to dollar)
				customer: stripCustomerId,
				payment_method: paymentMethodId,
				payment_method_types: ['card'],
				currency: this.stripeConfigService.stripeCurrency,
				description: 'Charge user wallet with ' + amount,
				receipt_email: customerEmail, // Email address that the receipt for the resulting payment will be sent to.
				confirm: true, // Immediately confirm the charge
			});

			this.logger.debug(
				'Successfully created payment intent, ' + paymentIntent.id,
			);

			return {
				success: true,
				message: paymentIntent.status,
				data: { paymentIntentId: paymentIntent.id },
			};
		} catch (error) {
			// There are an error
			this.logger.warn('Error while charging wallet, ' + error.message);

			return { success: false, message: error.message, data: null };
		}
	}

	/**
	 * Increment or decrement the balance of the user's wallet
	 * @param user
	 * @param amount
	 */
	private async updateWalletBalance(
		user: User | Buyer,
		amount: number,
		isWithdrawalOrAssurance: boolean,
	) {
		//? Check if the transaction is Withdrawal, so add negative sign to the amount to be decremented.
		if (isWithdrawalOrAssurance) {
			amount = -amount;
		}

		const wallet = await this.walletModel.updateOne(
			{ user },
			{ $inc: { balance: amount } },
		);

		if (!wallet) {
			throw new BadRequestException('Wallet not found ❌');
		}

		this.logger.debug('User wallet balance updated ✔✔💲 ');
	}
}
