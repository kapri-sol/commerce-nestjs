import { Account } from 'src/entity/account.entity';
import { getTestDatasource } from 'test/util/database.util';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from 'src/module/account/account.repository';

describe('Account Repository', () => {
  let datasource: DataSource;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    datasource = getTestDatasource({ entities: [Account] });

    await datasource.initialize();

    accountRepository = new AccountRepository(
      datasource.getRepository(Account),
    );
  });

  afterEach(async () => {
    await accountRepository.clear();
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  describe('create', () => {
    it('새로운 Account가 생성된다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);

      // when
      await accountRepository.save(account);

      // then
      expect(account.id).toStrictEqual(expect.any(BigInt));
      expect(account.email).toBe(email);
      expect(account.password).toStrictEqual(expect.any(String));
    });

    it('Account가 생성될 때, hashPassword가 동작한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);

      // when
      await accountRepository.save(account);

      const isRightPassword = await bcrypt.compareSync(
        password,
        account.password,
      );

      // then
      expect(isRightPassword).toBe(true);
    });
  });

    describe('update', () => {
      it('Account의 정보를 수정한다.', async () => {
        // given
        // when
        // then
      });
    });
  });
});
