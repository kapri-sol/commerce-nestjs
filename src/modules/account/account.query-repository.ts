import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@src/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountQueryRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findOneById(id: bigint): Promise<Account> {
    return this.accountRepository
      .createQueryBuilder()
      .where('id = :id', { id: id.toString() })
      .where('deleted_at is null')
      .getOne();
  }

  findOneByEmail(email: string): Promise<Account> {
    return this.accountRepository
      .createQueryBuilder()
      .where('email = :email', { email })
      .where('deleted_at is null')
      .getOne();
  }
}
