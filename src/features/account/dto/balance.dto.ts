import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class BalanceDto {
  @IsUUID()
  accountId: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
