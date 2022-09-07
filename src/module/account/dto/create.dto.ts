import { Account } from 'src/entity/account.entity';

export class CreateAccountDto {
  email: string;
  phone: string;
  password: string;

  toEntity() {
    return Account.of(this.email, this.phone, this.password);
  }
}
