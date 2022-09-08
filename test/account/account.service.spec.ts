import { AccountRepository } from 'src/module/account/account.repository';
import { AccountService } from 'src/module/account/account.service';
import { CreateAccountDto } from 'src/module/account/dto/create.dto';
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
import { Account } from 'src/entity/account.entity';

describe('Account Service', () => {
  let accountRepository: AccountRepository;
  let accountService: AccountService;
  const initialAccount = plainToInstance(Account, {
    _id: BigInt(1),
    _email: faker.internet.email(),
    _phone: faker.phone.number('+82 10-####-####'),
    _password: faker.internet.password(),
  });

  const saveAccount = (account?: Partial<Account>) =>
    plainToInstance(Account, {
      id: account?.id || BigInt(Math.floor(Math.random() * 100)),
      email: account?.email,
      phone: account?.phone,
      passsword: account?.password,
    });

  beforeEach(() => {
    const mockedAccountRepository = mock(AccountRepository);
    when(mockedAccountRepository.save(anyOfClass(Account))).thenResolve(
      saveAccount(),
    );
    when(mockedAccountRepository.findOneByEmail(anyString())).thenResolve(
      initialAccount,
    );
    when(mockedAccountRepository.findOneById(anything())).thenResolve(
      initialAccount,
    );

    accountRepository = instance(mockedAccountRepository);
    accountService = new AccountService(accountRepository);
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

    it('존재하지 않는 계정을 삭제하면, NotFoundErorr를 던진다.', async () => {
      // given
      const accountId = initialAccount.id;
      const updateAccountDto: UpdateAccountDto = {
        phone: faker.phone.number('+82 10-####-####'),
        password: faker.internet.password(),
      };

      when(mockedAccountRepository.findOneById(anything())).thenResolve(null);

      // when
      const updateAccount = () =>
        accountService.updateAccount(accountId, updateAccountDto);
      // then
      expect(updateAccount).rejects.toThrowError(NotFoundErorr);
    });
  });
});
