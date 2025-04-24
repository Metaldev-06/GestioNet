import { Injectable } from '@nestjs/common';
import { CreateFuelVoucherDto } from './dto/create-fuel-voucher.dto';
import { UpdateFuelVoucherDto } from './dto/update-fuel-voucher.dto';

@Injectable()
export class FuelVouchersService {
  create(createFuelVoucherDto: CreateFuelVoucherDto) {
    return 'This action adds a new fuelVoucher';
  }

  findAll() {
    return `This action returns all fuelVouchers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fuelVoucher`;
  }

  update(id: number, updateFuelVoucherDto: UpdateFuelVoucherDto) {
    return `This action updates a #${id} fuelVoucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} fuelVoucher`;
  }
}
