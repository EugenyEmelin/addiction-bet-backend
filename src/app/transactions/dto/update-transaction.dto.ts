import { PartialType } from '@nestjs/mapped-types';
import { TransactionDto } from './transactionDto';

export class UpdateTransactionDto extends PartialType(TransactionDto) {}
