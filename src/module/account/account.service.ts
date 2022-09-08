import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  /**
   * 계정을 생성한다.
   *
   * @param {CreateAccountDto} createAccountDto
   * @return {*}  {Promise<bigint>}
   * @memberof AccountService
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<bigint> {
    const account = createAccountDto.toEntity();
    const createAccount = await this.accountRepository.save(account);
    return createAccount.id;
  }

    await this.accountRepository.save(account);
    return account.id;
  }
}
