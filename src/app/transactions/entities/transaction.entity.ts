import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';

export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: TransactionType;

  @Column()
  hash: string;

  @Column()
  coin: string;

  @Column()
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created?: Date;
}
