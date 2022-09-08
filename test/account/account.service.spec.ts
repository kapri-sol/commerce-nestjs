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

      const account = await accountService.createAccount(createAccountDto);

      console.log(account);

      // when
      //   expect(accountService.createAccount(createAccountDto));
      // then
    });
  });
});
