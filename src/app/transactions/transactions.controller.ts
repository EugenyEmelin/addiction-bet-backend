import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/transactionDto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('withdraw')
  withdraw(@Body() withdrawDto: TransactionDto) {
    return this.transactionsService.withdraw(withdrawDto);
  }

  @Post('deposit')
  deposit(@Body() withdrawDto: TransactionDto) {
    return this.transactionsService.deposit(withdrawDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }
}
