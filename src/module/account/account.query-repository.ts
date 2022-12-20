import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountQueryRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findOneById(id: bigint): Promise<Account> {
    return this.accountRepository
      .createQueryBuilder('account')
      .where('account.account_id = :id', { id: id.toString() })
      .where('account.deleted_at is null')
      .getOne();
  }

  findOneByEmail(email: string): Promise<Account> {
    return this.accountRepository
      .createQueryBuilder('account')
      .where('account.email = :email', { email })
      .where('account.deleted_at is null')
      .getOne();
  }
}
