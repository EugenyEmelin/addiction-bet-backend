import { IsNumber, IsPositive, IsString } from 'class-validator';

export class WithdrawDto {
  @IsString()
  walletAddress: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
