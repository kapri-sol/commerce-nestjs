import { faker } from '@faker-js/faker';
import { Account } from '@src/entities/account.entity';

describe('Account Domain', () => {
  describe('of', () => {
    it('계정을 생성한다.', () => {
      // given
      const email = faker.internet.email();
      const phone = faker.phone.number('+82 10-####-####');
      const password = faker.internet.password();

      // when
      const account = Account.of(email, phone, password);

      // then
      expect(account.email).toBe(email);
      expect(account.phone).toBe(phone);
      expect(account.password).toBe(password);
    });
  });

  describe('update', () => {
    it('계정 정보를 수정한다.', () => {
      // given
      const email = faker.internet.email();
      const phone = faker.phone.number('+82 10-####-####');
      const password = faker.internet.password();

      const account = Account.of(email, phone, password);

      const updatePhone = faker.phone.number('+82 10-####-####');
      const updatePassword = faker.internet.password();

      // when
      account.update(updatePhone, updatePassword);

      // then

      expect(account.phone).toBe(updatePhone);
      expect(account.password).toBe(updatePassword);
    });
  });

  describe('hashPassword', () => {
    it('비밀번호를 해시한다.', async () => {
      // given
      const email = faker.internet.email();
      const phone = faker.phone.number('+82 10-####-####');
      const password = faker.internet.password();

      const account = Account.of(email, phone, password);

      // when
      await account.hashPassword();

      const isValid = await account.validatePassword(password);

      // then
      expect(account.password).not.toBe(password);
      expect(isValid).toBe(true);
    });
  });
});
