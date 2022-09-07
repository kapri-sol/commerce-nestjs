import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './dto/create.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<bigint> {
    const account = createAccountDto.toEntity();
    await this.accountRepository.save(account);
    return account.id;
  }
}
