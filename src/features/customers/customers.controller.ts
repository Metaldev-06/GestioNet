import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Role } from 'src/common/enums/system-role.enum';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@Auth(Role.REGULAR)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto);
  }

  @Get('sanitized')
  findAllSanitized() {
    return this.customersService.findAllSanitized();
  }

  @Get('summary')
  async getCustomerSummary() {
    return this.customersService.getCustomerSummary();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
