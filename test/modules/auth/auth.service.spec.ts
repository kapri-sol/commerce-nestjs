import { faker } from '@faker-js/faker';
import { Account } from '@src/entities/account.entity';
import { AccountService } from '@src/modules/account/account.service';
import { AuthService } from '@src/modules/auth/auth.service';
import { anyString, instance, mock, when } from 'ts-mockito';

describe('Auth Service', () => {
  let mockedAccountService: AccountService;
  let accountService: AccountService;
  let authService: AuthService;

  beforeAll(() => {
    mockedAccountService = mock(AccountService);
  });

  beforeEach(() => {
    accountService = instance(mockedAccountService);
    authService = new AuthService(accountService);
  });

  describe('validate', () => {
    it('비교하는 password가 일치한다.', async () => {
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
      const isValidate = await authService.validateAccount(email, password);

      // then
      expect(isValidate).toBe(true);
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
      expect(isValidate).toBe(false);
    });
  });
});
