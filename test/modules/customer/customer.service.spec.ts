import { faker } from '@faker-js/faker';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';
import { AccountRepository } from '@src/modules/account/account.query-repository';
import { CustomerRepository } from '@src/modules/customer/customer.repository';
import { CustomerService } from '@src/modules/customer/customer.service';
import { CreateCustomerDto } from '@src/modules/customer/dto/create.dto';
import { plainToInstance } from 'class-transformer';
import { anyOfClass, anything, instance, mock, when } from 'ts-mockito';

describe('Customer Service', () => {
  let mockedAccountRepository: AccountRepository;
  let accountRepository: AccountRepository;
  let mockedCustomerRepository: CustomerRepository;
  let customerRepository: CustomerRepository;
  let customerService: CustomerService;

  const saveAccount = (account?: Partial<Account>) => {
    return plainToInstance(Account, {
      _id: account?.id || BigInt(Math.floor(Math.random() * 100)),
      _email: account?.email,
      _phone: account?.phone,
      _password: account?.password,
    });
  };

  const saveCustomer = (customer?: Partial<Customer>) => {
    return plainToInstance(Customer, {
      _id: customer?.id || BigInt(Math.floor(Math.random() * 100)),
      _name: customer?.name,
      _address: customer?.address,
    });
  };

  beforeAll(() => {
    mockedAccountRepository = mock(AccountRepository);
    mockedCustomerRepository = mock(CustomerRepository);
  });

  beforeEach(() => {
    when(mockedAccountRepository.save(anyOfClass(Account))).thenResolve(
      saveAccount(),
    );
    when(mockedCustomerRepository.save(anyOfClass(Customer))).thenResolve(
      saveCustomer(),
    );

    accountRepository = instance(mockedAccountRepository);
    customerRepository = instance(mockedCustomerRepository);
    customerService = new CustomerService(
      accountRepository,
      customerRepository,
    );
  });

  describe('createCustomer', () => {
    it('고객을 생성한다.', async () => {
      // given
      const account = Account.of(
        faker.internet.email(),
        faker.phone.number('+82 10-####-####'),
        faker.internet.password(),
      );
      const createAccount = await accountRepository.save(account);

      when(mockedAccountRepository.findOneById(anything())).thenResolve(
        createAccount,
      );

      // when
      const createCustomerDto: CreateCustomerDto = plainToInstance(
        CreateCustomerDto,
        {
          name: faker.name.fullName(),
          address: faker.address.streetAddress(),
          accountId: account.id,
        },
      );

      const customerId = await customerService.createCustomer(
        createCustomerDto,
      );

      expect(customerId).toStrictEqual(expect.any(BigInt));
    });
  });
});
