import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';
import { AccountQueryRepository } from '@src/modules/account/account.query-repository';
import { CustomerRepository } from '@src/modules/customer/customer.repository';
import { CustomerService } from '@src/modules/customer/customer.service';
import { CreateCustomerDto } from '@src/modules/customer/dto/create.dto';
import { plainToInstance } from 'class-transformer';
import { anyOfClass, anything, instance, mock, when } from 'ts-mockito';
import { Repository } from 'typeorm';

describe('Customer Service', () => {
  let mockedAccountRepository: Repository<Account>;
  let accountRepository: Repository<Account>;
  let mockedAccountQueryRepository: AccountQueryRepository;
  let accountQueryRepository: AccountQueryRepository;
  let mockedCustomerRepository: CustomerRepository;
  let customerRepository: CustomerRepository;
  let customerService: CustomerService;

  const initializeAccount = () => {
    return Account.of(
      faker.internet.email(),
      faker.phone.number('+82 10-####-####'),
      faker.internet.password(),
    );
  };

  const initializeCustomer = () => {
    return Customer.of(
      faker.name.fullName(),
      faker.address.streetAddress(),
      initializeAccount(),
    );
  };
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
    mockedAccountRepository = mock(Repository<Account>);
    mockedAccountQueryRepository = mock(AccountQueryRepository);
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
    accountQueryRepository = instance(mockedAccountQueryRepository);
    customerRepository = instance(mockedCustomerRepository);
    customerService = new CustomerService(
      accountQueryRepository,
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

      when(mockedAccountQueryRepository.findOneById(anything())).thenResolve(
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

  describe('findCustomerById', () => {
    it('고객을 id로 검색한다.', async () => {
      // given
      const customer = initializeCustomer();
      const createCustomer = await customerRepository.save(customer);

      when(mockedCustomerRepository.findOneById(createCustomer.id)).thenResolve(
        createCustomer,
      );

      // when
      const findCustomer = await customerService.findCustomerById(
        createCustomer.id,
      );

      // then
      expect(findCustomer.id).toBe(createCustomer.id);
      expect(findCustomer.name).toBe(createCustomer.name);
      expect(findCustomer.address).toBe(createCustomer.address);
    });

    it('id로 검색된 고객이 없다면 NotFoundException을 반환한다.', async () => {
      // given
      const customerId = BigInt(1);

      when(mockedCustomerRepository.findOneById(customerId)).thenResolve(null);

      // when
      const findCustomer = () => customerService.findCustomerById(customerId);

      // then
      expect(findCustomer).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateCustomer', () => {
    it('고객을 id로 검색한다.', async () => {
      // given
      const customer = initializeCustomer();
      const createCustomer = await customerRepository.save(customer);

      when(mockedCustomerRepository.findOneById(createCustomer.id)).thenResolve(
        createCustomer,
      );

      // when
      const findCustomer = await customerService.findCustomerById(
        createCustomer.id,
      );

      // then
      expect(findCustomer.id).toBe(createCustomer.id);
      expect(findCustomer.name).toBe(createCustomer.name);
      expect(findCustomer.address).toBe(createCustomer.address);
    });
  });
});
