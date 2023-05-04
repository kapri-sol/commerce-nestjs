import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@src/entities/account.entity';
import { Repository } from 'typeorm';
import { AccountQueryRepository } from './account.query-repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly accountQueryRepository: AccountQueryRepository,
  ) {}

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
  async findAccountById(accountId: bigint): Promise<Account> {
    const account = await this.accountRepository.findOneBy({
      id: accountId,
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  /**
   * 계정을 email로 검색한다.
   *
   * @param {string} email
   * @return {*}  {Promise<Account>}
   * @memberof AccountService
   */
  async findAccountByEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({
      email,
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  /**
   * 계정과 고객을 계정 id로 검색한다.
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<Account>}
   * @memberof AccountService
   */
  async findAccountWithCustomerById(accountId: bigint) {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
      },
      relations: ['customer'],
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  /**
   * 계정과 고객을 계정 id로 검색한다.
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<Account>}
   * @memberof AccountService
   */
  async findAccountWithSellerById(accountId: bigint) {
    const account = await this.accountRepository.findOne({
      where: {
        id: accountId,
      },
      relations: ['seller'],
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account;
  }

  /**
   * 계정을 수정한다.
   *
   * @param {bigint} accountId
   * @param {UpdateAccountDto} updateAccountDto
   * @return {*}  {Promise<void>}
   * @memberof AccountService
   */
  async updateAccount(
    accountId: bigint,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.accountQueryRepository.findOneById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    const { phone, password } = updateAccountDto;

    account.update(phone, password);

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
    const account = await this.accountQueryRepository.findOneById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    await this.accountRepository.softRemove(account);
  }
}
