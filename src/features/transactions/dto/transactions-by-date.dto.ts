import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class TransactionsByDateDto {
  @IsNumber()
  @IsPositive()
  year: number;

  @IsNumber()
  @IsPositive()
  month: number;

  @IsUUID()
  @IsOptional()
  customerId?: string;

  @IsUUID()
  @IsOptional()
  accountId?: string;
}
