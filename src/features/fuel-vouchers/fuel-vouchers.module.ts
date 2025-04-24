import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuelVouchersService } from './fuel-vouchers.service';
import { FuelVouchersController } from './fuel-vouchers.controller';
import { FuelVoucher } from './entities/fuel-voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelVoucher])],
  controllers: [FuelVouchersController],
  providers: [FuelVouchersService],
})
export class FuelVouchersModule {}
