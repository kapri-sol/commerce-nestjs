import { Account } from '@src/entity/account.entity';
import { Customer } from '@src/entity/customer.entity';
import { Repository } from 'typeorm';

describe('Real Account Service', () => {
  let accountRepository: Repository<Account>;
  let customerRepository: Repository<Customer>;

  describe('createAccount', () => {
    it('create account', () => {});
  });
});
