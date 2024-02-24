import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Web3 } from 'web3';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  checkSignature(signature: string, walletAddress: string) {
    const web3 = new Web3('');
    const signingAddress = web3.eth.accounts.recover(
      `Addiction wants you to sign in with your Ethereum account: ${walletAddress}`,
      signature,
    );
    return signingAddress.toLowerCase() === walletAddress.toLowerCase();
  }
  async login(loginDto: LoginDto) {
    const isValidSignature = this.checkSignature(
      loginDto.signature,
      loginDto.walletAddress,
    );
    if (!isValidSignature) {
      throw new BadRequestException('Сигнатура не валидна');
    }
    const user = await this.usersService.findOneByWalletAddress(
      loginDto.walletAddress,
    );
    if (!user) {
      await this.usersService.create({ walletAddress: loginDto.walletAddress });
    }
    const payload = {
      signature: loginDto.signature,
      walletAddress: loginDto.walletAddress,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(walletAddress: string) {
    const user = await this.usersService.findOneByWalletAddress(walletAddress);
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return user;
  }
}
