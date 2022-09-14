import { faker } from '@faker-js/faker';
import { Account } from 'src/entity/account.entity';
import { Customer } from 'src/entity/customer.entity';
import { CustomerRepository } from 'src/module/customer/customer.repository';
import { getTestDatasource } from 'test/util/database.util';
import { DataSource } from 'typeorm';

describe('Customer Repository', () => {
  let datasource: DataSource;
  let customerRepository: CustomerRepository;

  const generateName = () => faker.name.fullName();
  const generateAddress = () => faker.address.streetAddress();
  const initializeCustomer = () => {
    const name = generateName();
    const address = generateAddress();
    const customer = Customer.of(name, address);

    return customerRepository.save(customer);
  };

  beforeAll(async () => {
    datasource = getTestDatasource({ entities: [Account, Customer] });

    await datasource.initialize();

    customerRepository = new CustomerRepository(
      datasource.getRepository(Customer),
    );
  });

  afterEach(async () => {
    await customerRepository.clear();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  describe('create Customer', () => {
    it('새로운 고객이 생성된다.', async () => {
      // given
      const name = generateName();
      const address = generateAddress();
      const customer = Customer.of(name, address);

      // when
      await customerRepository.save(customer);
      const findCustomer = await customerRepository.findOneById(customer.id);

      // then
      expect(findCustomer.id).toBe(customer.id);
      expect(findCustomer.name).toBe(customer.name);
      expect(findCustomer.address).toStrictEqual(customer.address);
    });
  });

  describe('find Customer', () => {
    it('id로 Customer를 검색한다.', async () => {
      // given
      const customer = await initializeCustomer();

      // when
      const findCustomer = await customerRepository.findOneById(customer.id);

      // then
      expect(findCustomer.id).toBe(customer.id);
      expect(findCustomer.name).toBe(customer.name);
      expect(findCustomer.address).toBe(customer.address);
    });
  });

  describe('update Customer', () => {
    it('고객 정보를 수정한다.', async () => {
      // given
      const customer = await initializeCustomer();
      const name = generateName();
      const address = generateAddress();

      // when
      customer.changeName(name);
      customer.changeAddress(address);
      await customerRepository.save(customer);
      const updateCustomer = await customerRepository.findOneById(customer.id);
      // then
      expect(updateCustomer.id).toBe(customer.id);
      expect(updateCustomer.name).toBe(name);
      expect(updateCustomer.address).toBe(address);
    });
  });

  describe('remove Customer', () => {
    it('고객을 삭제한다.', async () => {
      // given
      const customer = await initializeCustomer();

      // when
      await customerRepository.softRemove(customer);
      const deleteCustomer = await customerRepository.findOneById(customer.id);

      // then
      expect(deleteCustomer).toBeNull();
    });
  });
});
