import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  save(account: Account): Promise<Account> {
    return this.accountRepository.save(account);
  }

  findOneById(id: bigint): Promise<Account> {
    return this.accountRepository
      .createQueryBuilder('account')
      .where('account.account_id = :id', { id: id.toString() })
      .getOne();
  }

  findOneByEmail(email: string): Promise<Account> {
    return this.accountRepository
      .createQueryBuilder('account')
      .where('account.email = :email', { email })
      .getOne();
  }

  findAll() {
    return this.accountRepository.find();
  }

  clear() {
    return this.accountRepository.clear();
  }
}
