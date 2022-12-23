import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@src/entities/account.entity';
import { AccountService } from '@src/modules/account/account.service';
import { JwtAuthService } from '@src/modules/auth/jwt-auth.service';
import { plainToClass } from 'class-transformer';
import { anyString, instance, mock, when } from 'ts-mockito';

describe('Session Auth Service', () => {
  let mockedAccountService: AccountService;
  let accountService: AccountService;
  let authService: JwtAuthService;

  beforeAll(() => {
    mockedAccountService = mock(AccountService);
  });

  beforeEach(() => {
    accountService = instance(mockedAccountService);
    authService = new JwtAuthService(accountService, new JwtService());
  });

  describe('validate', () => {
    it('비교하는 password가 일치한다.', async () => {
      // given
      const id = BigInt(Math.floor(Math.random() * 100));
      const email = faker.internet.email();
      const password = faker.internet.password();
      const createAccount = plainToClass(Account, {
        _id: id,
        _email: email,
        _phone: faker.phone.number('+82 10-####-####'),
        _password: password,
      });

      await createAccount.hashPassword();

      when(mockedAccountService.findAccountByEmail(email)).thenResolve(
        createAccount,
      );

      // when
      const account = await authService.validateAccount(email, password);

      // then
      expect(account.id).toBe(id.toString());
    });

    it('비교하는 password가 일치하지 않는다.', async () => {
      // given
      const email = faker.internet.email();
      const phone = faker.phone.number('+82 10-####-####');
      const password = faker.internet.password();
      const account = Account.of(email, phone, password);
      await account.hashPassword();

      when(mockedAccountService.findAccountByEmail(anyString())).thenResolve(
        account,
      );

      // when
      const isValidate = await authService.validateAccount(
        email,
        faker.internet.password(),
      );

      // then
      expect(isValidate).toBeNull();
    });
  });
});
