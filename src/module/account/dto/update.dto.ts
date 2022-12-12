import { IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsPhoneNumber('KR')
  phone: string;

  @IsString()
  password: string;
}
