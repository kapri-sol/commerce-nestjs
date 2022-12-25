import { AccountService } from '@src/modules/account/account.service';
import { CreateAccountDto } from '@src/modules/account/dto/create-account.dto';
import {
  mock,
  instance,
  when,
  anyOfClass,
  anyString,
  anything,
} from 'ts-mockito';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { Account } from '@src/entities/account.entity';
import { UpdateAccountDto } from '@src/modules/account/dto/update-account.dto';
import { AccountQueryRepository } from '@src/modules/account/account.query-repository';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Account Service', () => {
  let mockedAccountRepository: Repository<Account>;
  let accountRepository: Repository<Account>;
  let mockedAccountQueryRepository: AccountQueryRepository;
  let accountQueryRepository: AccountQueryRepository;
  let accountService: AccountService;

  const initialAccount = plainToInstance(Account, {
    _id: BigInt(1),
    _email: faker.internet.email(),
    _phone: faker.phone.number('+82 10-####-####'),
    _password: faker.internet.password(),
  });

  const saveAccount = (account?: Partial<Account>) => {
    return plainToInstance(Account, {
      _id: account?.id || BigInt(Math.floor(Math.random() * 100)),
      _email: account?.email,
      _phone: account?.phone,
      _password: account?.password,
    });
  };

  beforeAll(() => {
    mockedAccountRepository = mock(Repository<Account>);
    mockedAccountQueryRepository = mock(AccountQueryRepository);
  });

  beforeEach(() => {
    when(mockedAccountRepository.save(anyOfClass(Account))).thenResolve(
      saveAccount(),
    );

    when(mockedAccountRepository.softRemove(anything())).thenResolve(undefined);

    accountRepository = instance(mockedAccountRepository);
    accountQueryRepository = instance(mockedAccountQueryRepository);
    accountService = new AccountService(
      accountRepository,
      accountQueryRepository,
    );
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
      const accountId = initialAccount.id;

      when(mockedAccountQueryRepository.findOneById(anything())).thenResolve(
        initialAccount,
      );
      // when
      const findAccount = await accountService.findAccountById(accountId);

      // then
      expect(findAccount.id).toBe(accountId);
      expect(findAccount.email).toBe(initialAccount.email);
      expect(findAccount.phone).toBe(initialAccount.phone);
      expect(findAccount.password).toStrictEqual(expect.any(String));
    });

    it('email로 계정을 검색한다.', async () => {
      // given
      const email = initialAccount.email;

      when(
        mockedAccountQueryRepository.findOneByEmail(anyString()),
      ).thenResolve(initialAccount);

      // when
      const findAccount = await accountService.findAccountByEmail(email);
      // then
      expect(findAccount.id).toBe(initialAccount.id);
      expect(findAccount.email).toBe(email);
      expect(findAccount.phone).toBe(initialAccount.phone);
      expect(findAccount.password).toStrictEqual(expect.any(String));
    });
  });

  describe('updateAccount', () => {
    it('계정 정보를 수정한다.', async () => {
      // given
      const accountId = initialAccount.id;
      const updateAccountDto: UpdateAccountDto = {
        phone: faker.phone.number('+82 10-####-####'),
        password: faker.internet.password(),
      };

      when(mockedAccountRepository.save(anyOfClass(Account))).thenResolve(
        saveAccount({
          id: accountId,
          email: initialAccount.email,
          phone: updateAccountDto.phone,
          password: updateAccountDto.password,
        }),
      );

      // when
      const updateAccount = await accountService.updateAccount(
        accountId,
        updateAccountDto,
      );

      // then
      expect(updateAccount.id).toBe(accountId);
      expect(updateAccount.phone).toBe(updateAccountDto.phone);
      expect(updateAccount.password).toStrictEqual(expect.any(String));
    });

    it('존재하지 않는 계정을 수정하려고 하면, NotFoundException을 던진다.', async () => {
      // given
      const accountId = initialAccount.id;
      const updateAccountDto: UpdateAccountDto = {
        phone: faker.phone.number('+82 10-####-####'),
        password: faker.internet.password(),
      };

      when(mockedAccountQueryRepository.findOneById(anything())).thenResolve(
        null,
      );

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
      const accountId = initialAccount.id;
      // when
      const deleteAccount = () => accountService.deleteAccountById(accountId);
      // then
      expect(deleteAccount).not.toThrow();
    });

    it('존재하지 않는 계정을 삭제하려고 하면, NotFoundException을 던진다.', async () => {
      // given
      const accountId = initialAccount.id;
      when(mockedAccountQueryRepository.findOneById(anything())).thenResolve(
        null,
      );

      // when
      const deleteAccount = () => accountService.deleteAccountById(accountId);

      // then
      expect(deleteAccount).rejects.toThrowError(NotFoundException);
    });
  });
});
