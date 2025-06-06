import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TransactionsService } from './transactions.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/system-role.enum';

@Controller('transactions')
@Auth(Role.REGULAR)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Transactions')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get('by-year/:accountId')
  async getTransactionYears(@Param('accountId') accountId: string) {
    return this.transactionsService.getTransactionYears(accountId);
  }

  @Get('/by-date/:id')
  async getTransactionsByDate(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.transactionsService.getTransactionsByDate(accountId, year);
  }

  @Get('/by-month/:id')
  async getTransactionsByMonth(
    @Param('id', ParseUUIDPipe) accountId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.transactionsService.getTransactionsByMonth(
      accountId,
      year,
      month,
      page,
      limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }
}
