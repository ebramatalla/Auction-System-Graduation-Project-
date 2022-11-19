import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCurrentUserData, Roles } from 'src/common/decorators';
import WalletService from './wallet.service';
import { Role } from 'src/models/users/shared-user/enums';
import {
	ChargeWalletDto,
	RefundWalletDto,
	TransactionDto,
	WalletDto,
} from './dto';
import { User } from 'src/models/users/shared-user/schema/user.schema';
import TransactionService from './transaction.service';
import { Serialize } from 'src/common/interceptors';

@ApiTags('Wallet')
@Controller('wallet')
export class StripeController {
	constructor(
		private readonly walletService: WalletService,
		private readonly transactionService: TransactionService,
	) {}

	//FIXME REMOVE This route
	@Get()
	@Roles(Role.Admin, Role.Employee)
	@Serialize(WalletDto)
	listAllWallets() {
		return this.walletService.listAllWallets();
	}

	@Get('balance')
	@Roles(Role.Seller, Role.Buyer)
	getWalletBalance(@GetCurrentUserData() user: User) {
		return this.walletService.getWalletBalance(user);
	}

	@Post('charge')
	@Roles(Role.Buyer)
	chargeWallet(
		@Body() chargeWalletDto: ChargeWalletDto,
		@GetCurrentUserData() user: User,
	) {
		return this.walletService.chargeWallet(
			chargeWalletDto.amount,
			chargeWalletDto.paymentMethodId,
			user,
		);
	}

	@Post('refund')
	@Roles(Role.Seller, Role.Buyer)
	refund(
		@Query() { paymentIntentId }: RefundWalletDto,
		@GetCurrentUserData() user: User,
	) {
		return this.walletService.refundMoney(user, paymentIntentId);
	}

	@Serialize(TransactionDto)
	@Roles(Role.Seller, Role.Buyer)
	@Get('transactions')
	listTransactionsForUser(@GetCurrentUserData() user: User) {
		return this.transactionService.listTransactionsForUser(user);
	}
}
