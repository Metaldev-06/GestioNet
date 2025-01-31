import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../account/entities/account.entity';
import { Customer } from './entities/customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { PaginationService } from 'src/common/services/pagination/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Account])],
  controllers: [CustomersController],
  providers: [CustomersService, PaginationService],
})
export class CustomersModule {}
