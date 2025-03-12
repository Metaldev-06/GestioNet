import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  dni?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  city?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  email?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  phone?: string;
}
