import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.usersRepository.save(createUserDto);
    console.log(createdUser, 'createdUser');
    return createdUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    console.log(user, 'user');
    return user;
  }

  async findOneByWalletAddress(walletAddress: string) {
    const user = await this.usersRepository.findOneBy({ walletAddress });
    console.log(user, 'user');
    return user;
  }
}
