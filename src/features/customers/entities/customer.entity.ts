import { Exclude } from 'class-transformer';
import { Account } from 'src/features/account/entities/account.entity';
import { FuelVoucher } from 'src/features/fuel-vouchers/entities/fuel-voucher.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: true,
    unique: false,
  })
  dni: string;

  @Column('text', {
    nullable: true,
  })
  address: string;

  @Column('text', {
    nullable: true,
  })
  city: string;

  @Column('text', {
    nullable: true,
  })
  email: string;

  @Column('text', {
    nullable: true,
  })
  phone: string;

  @OneToOne(() => Account, (account) => account.customer, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  account: Relation<Account>;

  @OneToMany(() => FuelVoucher, (fuelVoucher) => fuelVoucher.customerId, {})
  fuelVauchers: Relation<FuelVoucher[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;
}
