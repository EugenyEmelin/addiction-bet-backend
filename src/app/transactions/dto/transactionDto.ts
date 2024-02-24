import { IsNumber, IsPositive, IsString } from 'class-validator';

export class TransactionDto {
  @IsString()
  walletAddress: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
