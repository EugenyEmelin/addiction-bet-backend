import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  login(loginDto: LoginDto) {
    console.log(loginDto.signature, loginDto.walletAddress);
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
