import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';

import { AccountService } from './account.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { BalanceDto } from './dto/balance.dto';
import { Role } from 'src/common/enums/system-role.enum';

@Controller('account')
@Auth(Role.REGULAR)
@UseInterceptors(ClassSerializerInterceptor)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('balance')
  addBalance(@Body() addBalanceDto: BalanceDto) {
    return this.accountService.addBalance(addBalanceDto);
  }

  @Post('reduce')
  reduceBalance(@Body() addBalanceDto: BalanceDto) {
    return this.accountService.reduceBalance(addBalanceDto);
  }

  @Post('settle-debt')
  settleDebt(@Body() addBalanceDto: BalanceDto) {
    return this.accountService.settleDebt(addBalanceDto);
  }
}
