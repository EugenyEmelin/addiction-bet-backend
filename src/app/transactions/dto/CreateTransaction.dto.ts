import { IsEnum, IsInt, IsNumber, IsPositive, IsString } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  hash: string;

  @IsString()
  coin: string;

  @IsInt()
  @IsPositive()
  time: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}
