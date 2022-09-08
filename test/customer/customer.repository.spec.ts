import { Account } from 'src/entity/account.entity';
import { Customer } from 'src/entity/customer.entity';
import { CustomerRepository } from 'src/module/customer/customer.repository';
import { getTestDatasource } from 'test/util/database.util';
import { DataSource } from 'typeorm';

describe('Customer Repository', () => {
  let datasource: DataSource;
  let customerRepository: CustomerRepository;

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
});
