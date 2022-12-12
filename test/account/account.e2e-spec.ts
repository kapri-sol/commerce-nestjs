import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '@src/entity/account.entity';
import { AccountModule } from '@src/module/account/account.module';
import { Repository } from 'typeorm';

describe('Account e2e', () => {
  let app: NestApplication;
  let accountRepository: Repository<Account>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    app = module.createNestApplication();
    accountRepository = module.get(getRepositoryToken(Account));

    await app.init();
  });
});
