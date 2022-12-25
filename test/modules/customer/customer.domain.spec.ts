import { faker } from '@faker-js/faker';
import { Account } from '@src/entities/account.entity';
import { Customer } from '@src/entities/customer.entity';

describe('Customer Domain', () => {
  const initializeAccount = () => {
    const email = faker.internet.email();
    const phone = faker.phone.number('+82 10-####-####');
    const password = faker.internet.password();

    return Account.of(email, phone, password);
  };

  describe('of', () => {
    it('고객을 생성한다.', async () => {
      // given
      const name = faker.name.fullName();
      const address = faker.address.streetAddress();
      const account = initializeAccount();

      // when
      const customer = Customer.of(name, address, account);

      // then
      expect(customer.name).toBe(name);
      expect(customer.address).toBe(address);
      expect(customer.account).toStrictEqual(account);
    });
  });

  describe('update', () => {
    it('고객 정보를 수정한다.', async () => {
      // given
      const name = faker.name.fullName();
      const address = faker.address.streetAddress();
      const account = initializeAccount();

      const customer = Customer.of(name, address, account);

      const updateName = faker.name.fullName();
      const updateAddress = faker.address.streetAddress();

      // when
      customer.update(updateName, updateAddress);

      // then
      expect(customer.name).toBe(updateName);
      expect(customer.address).toBe(updateAddress);
      expect(customer.account).toStrictEqual(account);
    });
  });
});
