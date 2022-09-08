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

  /**
   * 계정을 id로 검색한다.
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<Account>}
   * @memberof AccountService
   */
  findAccountById(accountId: bigint): Promise<Account> {
    return this.accountRepository.findOneById(accountId);
  }

    await this.accountRepository.save(account);
    return account.id;
  }
}
