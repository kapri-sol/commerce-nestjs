import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsPhoneNumber('KR')
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  password: string;
}
