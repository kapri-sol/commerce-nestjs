import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { AccountService } from '../account/account.service';

@Injectable()
export class AuthService {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 계정의 패스워드와 일치하는지 확인한다.
   *
   * @param {string} email
   * @param {string} password
   * @return {*}
   * @memberof AuthService
   */
  async validateAccount(email: string, password: string) {
    const account = await this.accountService.findAccountByEmail(email);

    const validateResult = await account?.validatePassword(password);

    return validateResult
      ? {
          ...instanceToPlain(account),
          _id: account.id.toString(),
        }
      : null;
  }
}
