import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuelVouchersService } from './fuel-vouchers.service';
import { CreateFuelVoucherDto } from './dto/create-fuel-voucher.dto';
import { UpdateFuelVoucherDto } from './dto/update-fuel-voucher.dto';

@Controller('fuel-vouchers')
export class FuelVouchersController {
  constructor(private readonly fuelVouchersService: FuelVouchersService) {}

  @Post()
  create(@Body() createFuelVoucherDto: CreateFuelVoucherDto) {
    return this.fuelVouchersService.create(createFuelVoucherDto);
  }

  @Get()
  findAll() {
    return this.fuelVouchersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelVouchersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuelVoucherDto: UpdateFuelVoucherDto) {
    return this.fuelVouchersService.update(+id, updateFuelVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelVouchersService.remove(+id);
  }
}
