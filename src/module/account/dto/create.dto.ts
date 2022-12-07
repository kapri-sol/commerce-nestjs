import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { Account } from 'src/entity/account.entity';

export class CreateAccountDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber('KR')
  phone: string;

  @IsString()
  password: string;

  toEntity() {
    return Account.of(this.email, this.phone, this.password);
  }
}
