import { Injectable } from '@nestjs/common';
import { Account } from 'src/entity/account.entity';
import { NotFoundErorr } from 'src/error/not-found.error';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create.dto';
import { UpdateAccountDto } from './dto/update.dto';

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

  /**
   * 계정을 email로 검색한다.
   *
   * @param {string} email
   * @return {*}  {Promise<Account>}
   * @memberof AccountService
   */
  findAccountByEmail(email: string): Promise<Account> {
    return this.accountRepository.findOneByEmail(email);
  }

  /**
   * 계정을 수정한다.
   *
   * @param {bigint} accountId
   * @param {UpdateAccountDto} udpateAccountDto
   * @return {*}  {Promise<void>}
   * @memberof AccountService
   */
  async updateAccount(
    accountId: bigint,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.accountRepository.findOneById(accountId);

    if (!account) {
      throw new NotFoundErorr();
    }

    if (updateAccountDto.phone) {
      account.changePhone(updateAccountDto.phone);
    }

    if (updateAccountDto.password) {
      account.changePassword(updateAccountDto.password);
    }

    return this.accountRepository.save(account);
  }

  /**
   * 계정을 id로 삭제한다.
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<void>}
   * @memberof AccountService
   */
  async deleteAccountById(accountId: bigint): Promise<void> {
    const account = await this.accountRepository.findOneById(accountId);

    if (!account) {
      throw new NotFoundErorr();
    }

    await this.accountRepository.softRemove(account);
  }
}
