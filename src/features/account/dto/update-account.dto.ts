import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './balance.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
