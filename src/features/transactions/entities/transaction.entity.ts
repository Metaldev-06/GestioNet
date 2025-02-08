import { TransactionType } from 'src/common/enums/transaction-type.enum,';
import { Account } from 'src/features/account/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.transactions, {
    eager: true,
  })
  accountId: Relation<Account>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Monto de la transacción (positivo o negativo).

  @Column('text', {
    default: TransactionType.CREDIT,
  })
  type: TransactionType; // Tipo de transacción.

  @Column({ nullable: true })
  description: string; // Descripción (e.g., "Carga de combustible").

  @CreateDateColumn()
  createdAt: Date;
}
