import { IsNotEmpty, IsNumber, Min, IsEnum, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';
import { TransactionType } from '../enums';

export class CreateTransactionDto {
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	amount: number;

	@IsNotEmpty()
	sender: ObjectId;

	@IsNotEmpty()
	recipient: ObjectId;

	@IsEnum(TransactionType)
	transactionType: TransactionType;

	@IsBoolean()
	isBlockAssuranceTransaction: boolean;

	@IsNotEmpty()
	paymentIntentId: string;
}
