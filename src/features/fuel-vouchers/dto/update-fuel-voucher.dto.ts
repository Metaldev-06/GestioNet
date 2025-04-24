import { PartialType } from '@nestjs/swagger';
import { CreateFuelVoucherDto } from './create-fuel-voucher.dto';

export class UpdateFuelVoucherDto extends PartialType(CreateFuelVoucherDto) {}
