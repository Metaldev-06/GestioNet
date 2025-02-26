import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class BalanceDto {
  @IsUUID()
  accountId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  description?: string;
}
