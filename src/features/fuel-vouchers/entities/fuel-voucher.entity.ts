import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { StateVoucher } from 'src/common/enums/sort-order.enum copy';
import { Customer } from 'src/features/customers/entities/customer.entity';

@Entity()
export class FuelVoucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  qrCodeData: string;

  @Column('text', {
    nullable: true,
  })
  veicleLicensePlate: string;

  @Column('text', {
    nullable: true,
  })
  km: number;

  @Column('text', {
    nullable: false,
  })
  autorizedBy: string;

  // @Column('text', {
  //   nullable: true,
  // })
  // signature: string;

  @Column('datetime', {
    nullable: false,
  })
  issueDate: Date;

  @Column('datetime', {
    nullable: false,
  })
  expirationDate: Date;

  @Column('numeric', {
    nullable: false,
    default: 0,
  })
  liters: number;

  @Column('text', {
    nullable: false,
    default: StateVoucher.ACTIVE,
  })
  state: StateVoucher;

  @Column('text', {
    nullable: true,
    default: null,
  })
  dateOfUse: Date | null;

  //Relationship with Customer
  @ManyToOne(() => Customer, (customer) => customer.fuelVauchers, {})
  customerId: Relation<Customer>;
}
