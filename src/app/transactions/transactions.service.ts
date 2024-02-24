import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transactionDto';
import { ethers } from 'ethers';
import { getDepositContractInstance } from './transactions.utils';
import { DepositContract } from '../../config';
import { Web3 } from 'web3';
import {
  DEFAULT_PROVIDER,
  DEFAULT_SIGNER_KEY,
} from '../../constants/resources.const';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { TransactionType } from './enums/transaction-type.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  async getBalance(walletAddress: string) {
    const web3 = new Web3(DEFAULT_PROVIDER);
    const balance = await web3.eth.getBalance(walletAddress);
    return Number(balance);
  }

  async deposit(transactionDto: TransactionDto) {
    const web3 = new Web3(DEFAULT_PROVIDER);

    // const web3 = new Web3('https://rpc.sepolia.org');
    const balance = await this.getBalance(DepositContract);
    console.log(balance, 'balance');
    if (balance < transactionDto.amount) {
      throw new BadRequestException('Недостаточно средств на балансе');
    }
    console.log(transactionDto.amount, 'transactionDto.amount');

    // const timeBet = Date.now() + 5 * 60 * 1000;
    const contractInstance = getDepositContractInstance(DepositContract);
    // console.log(contractInstance.methods, 'contractInstance');
    const tx: any = await contractInstance.methods
      .deposit(transactionDto.amount)
      .call();
    console.log(tx, 'tx ');

    const txSend = await web3.eth.sendTransaction({
      from: DepositContract,
      to: transactionDto.walletAddress,
      data: tx?.data,
      value: '0x0',
    });
    console.log(txSend, 'txSend');
  }
  async withdraw(withdrawDto: TransactionDto) {
    const signerKey = DEFAULT_SIGNER_KEY;

    // const web3 = new Web3('https://rpc.sepolia.org');
    const balance = await this.getBalance(withdrawDto.walletAddress);
    const address = withdrawDto.walletAddress;
    // ToDo: сменить > на <
    if (balance > withdrawDto.amount) {
      throw new BadRequestException('Недостаточно средств на балансе');
    }

    const provider = ethers.getDefaultProvider();
    const signer = new ethers.Wallet(signerKey, provider);
    const time = Math.ceil((Date.now() + 4 * 60 * 1000) / 1000);
    // const timeBet = Date.now() + 5 * 60 * 1000;
    const contractInstance = getDepositContractInstance(DepositContract);
    console.log(contractInstance.methods, 'contractInstance');
    const nonces = await contractInstance.methods.nonces(address).call();
    console.log(nonces, 'nonces');
    // console.log(contractInstance, 'contractInstance');
    // const nonce = await getDepositContractInstance(
    //   DepositContract,
    // )?.callStatic?.nonces(withdrawDto.walletAddress);

    const hash = ethers.solidityPacked(
      ['address', 'uint256', 'uint256', 'uint256'],
      [withdrawDto.walletAddress, time, 0, withdrawDto.amount],
    );
    console.log(hash, 'hash');

    const payloadHash = ethers.keccak256(hash);
    console.log(payloadHash, 'payloadHash');
    const arrayifiedMessage = ethers.toUtf8Bytes(payloadHash);
    console.log(arrayifiedMessage, 'arrayifiedMessage');
    const signature = await signer.signMessage(arrayifiedMessage);
    console.log(signature, 'signature');

    // Withdraw transaction
    const tx = await contractInstance.methods
      .withdrawTokens(withdrawDto.amount, time, Number(nonces), signature)
      .call();

    console.log(tx, 'tx');

    // Сохраним транзакцию в базу данных
    await this.create({
      type: TransactionType.Withdraw,
      hash: '',
      coin: '',
      time: time,
      amount: withdrawDto.amount,
    });
    return { signature, time, tx };
  }

  async create(createTransactionDto: CreateTransactionDto) {
    return this.transactionRepository.save(createTransactionDto);
  }
  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
}
