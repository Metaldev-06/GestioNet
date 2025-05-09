import { IsNumber, IsPositive } from 'class-validator';

export class UpdateAccountDto {
  @IsNumber()
  @IsPositive()
  debtLimit: number;
}
