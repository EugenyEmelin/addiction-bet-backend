import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';

@Entity()
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

  @Column()
  time: number;

  @CreateDateColumn()
  created?: Date;
}
