import { AccountService } from '@src/modules/account/account.service';
import { CreateAccountDto } from '@src/modules/account/dto/create-account.dto';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { Account } from '@src/entities/account.entity';
import { UpdateAccountDto } from '@src/modules/account/dto/update-account.dto';
import { AccountQueryRepository } from '@src/modules/account/account.query-repository';
import { DataSource, Repository } from 'typeorm';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { getMemDateSource } from 'test/utils/pg-mem.util';
import { IBackup } from 'pg-mem';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@src/entities/customer.entity';
import { Seller } from '@src/entities/seller.entity';
import { Product } from '@src/entities/product.entity';
import { Order } from '@src/entities/order.entity';
import { OrderItem } from '@src/entities/order-item.entity';

describe('Account Service', () => {
  let datasource: DataSource;
  let backup: IBackup;
  let app: INestApplication;
  let accountRepository: Repository<Account>;
  let accountQueryRepository: AccountQueryRepository;
  let accountService: AccountService;

  const initializeAccount = () => {
    const account = Account.of(
      faker.internet.email(),
      faker.phone.number('+82 10-####-####'),
      faker.internet.password(),
    );

    return accountRepository.save(account);
  };

  beforeAll(async () => {
    await getMemDateSource([
      Account,
      Customer,
      Seller,
      Product,
      Order,
      OrderItem,
    ]).then((data) => {
      datasource = data.datasource;
      backup = data.backup;
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Account, Customer, Seller]),
      ],
      providers: [AccountQueryRepository, AccountService],
    })
      .overrideProvider(DataSource)
      .useValue(datasource)
      .compile();

    app = module.createNestApplication();

    accountRepository = datasource.getRepository(Account);
    accountQueryRepository = module.get<AccountQueryRepository>(
      AccountQueryRepository,
    );
    accountService = module.get<AccountService>(AccountService);

    await app.init();
  });

  afterEach(async () => {
    await backup.restore();
  });

  describe('createAccount', () => {
    it('계정을 생성한다.', async () => {
      // given
      const createAccountDto: CreateAccountDto = plainToInstance(
        CreateAccountDto,
        {
          email: faker.internet.email(),
          phone: faker.phone.number('+82 10-####-####'),
          password: faker.internet.password(),
        },
      );

      // when
      const accountId = await accountService.createAccount(createAccountDto);
      // then
      expect(accountId).toStrictEqual(expect.any(BigInt));
    });
  });

  describe('findAccount', () => {
    it('id로 계정을 검색한다.', async () => {
      // given
      const account = await initializeAccount();

      // when
      const findAccount = await accountService.findAccountById(account.id);

      // then
      expect(findAccount.id).toBe(account.id);
      expect(findAccount.email).toBe(account.email);
      expect(findAccount.phone).toBe(account.phone);
      expect(findAccount.password).toBe(account.password);
    });

    it('email로 계정을 검색한다.', async () => {
      // given
      const account = await initializeAccount();

      // when
      const findAccount = await accountService.findAccountByEmail(
        account.email,
      );

      // then
      expect(findAccount.id).toBe(account.id);
      expect(findAccount.email).toBe(account.email);
      expect(findAccount.phone).toBe(account.phone);
      expect(findAccount.password).toBe(account.password);
    });
  });

  describe('updateAccount', () => {
    it('계정 정보를 수정한다.', async () => {
      // given
      const account = await initializeAccount();

      const updateAccountDto: UpdateAccountDto = {
        phone: faker.phone.number('+82 10-####-####'),
        password: faker.internet.password(),
      };

      // when
      const updateAccount = await accountService.updateAccount(
        account.id,
        updateAccountDto,
      );

      const isValid = await updateAccount.validatePassword(
        updateAccountDto.password,
      );

      // then
      expect(updateAccount.id).toBe(account.id);
      expect(updateAccount.phone).toBe(updateAccountDto.phone);
      expect(isValid).toBe(true);
    });

    it('존재하지 않는 계정을 수정하려고 하면, NotFoundException을 던진다.', async () => {
      // given
      const accountId = BigInt(faker.random.numeric());

      const updateAccountDto: UpdateAccountDto = {
        phone: faker.phone.number('+82 10-####-####'),
        password: faker.internet.password(),
      };

      // when
      const updateAccount = () =>
        accountService.updateAccount(accountId, updateAccountDto);

      // then
      expect(updateAccount).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteAccount', () => {
    it('계정을 id로 삭제한다.', async () => {
      // given
      const account = await initializeAccount();

      // when
      await accountService.deleteAccountById(account.id);

      const deleteAccount = await accountQueryRepository.findOneById(
        account.id,
      );

      // then
      expect(deleteAccount).toBeNull();
    });

    it('존재하지 않는 계정을 삭제하려고 하면, NotFoundException을 던진다.', async () => {
      // given
      const accountId = BigInt(faker.random.numeric());

      // when
      const deleteAccount = () => accountService.deleteAccountById(accountId);

      // then
      expect(deleteAccount).rejects.toThrowError(NotFoundException);
    });
  });
});
