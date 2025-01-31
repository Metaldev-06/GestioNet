import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  firstName?: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  lastName?: string;
}
