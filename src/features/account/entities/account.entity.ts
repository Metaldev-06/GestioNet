import { Exclude } from 'class-transformer';
import { Customer } from 'src/features/customers/entities/customer.entity';
import { Transaction } from 'src/features/transactions/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Customer, (customer) => customer.account)
  customer: Relation<Customer>;

  @OneToMany(() => Transaction, (transaction) => transaction.accountId)
  transactions: Relation<Transaction[]>;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number; // Saldo actual.

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  debt: number; // Deuda actual.

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  debtLimit: number; // Límite de deuda.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
