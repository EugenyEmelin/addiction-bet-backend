import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  signature: string;

  @IsString()
  walletAddress: string;
}
