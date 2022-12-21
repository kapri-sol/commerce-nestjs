import { Account } from '@src/entities/account.entity';
import { getTestDatasource } from 'test/utils/database.util';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Customer } from '@src/entities/customer.entity';
import { AccountQueryRepository } from '@src/modules/account/account.query-repository';

describe('Account Repository', () => {
  let datasource: DataSource;
  let accountRepository: Repository<Account>;
  let accountQueryRepository: AccountQueryRepository;

  beforeAll(async () => {
    datasource = getTestDatasource({ entities: [Account, Customer] });

    await datasource.initialize();

    accountRepository = datasource.getRepository(Account);
    accountQueryRepository = new AccountQueryRepository(
      datasource.getRepository(Account),
    );
  });

  afterEach(async () => {
    console.log(datasource.driver['pool']);

    await datasource.transaction(async (entityManager: EntityManager) => {
      await entityManager.query('SET FOREIGN_KEY_CHECKS = 0');
      await entityManager.getRepository(Customer).clear();
      await entityManager.getRepository(Account).clear();
      await entityManager.query('SET FOREIGN_KEY_CHECKS = 1');
    });
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
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);
      const updatePhone = faker.phone.number();

      // when
      account.changePhone(updatePhone);
      await accountRepository.save(account);

      // then
      expect(account.phone).toBe(updatePhone);
    });

    it('Account가 수정 될 때, hashPassword가 동작한다.', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);
      const updatePassword = faker.internet.password();
      await accountRepository.save(account);

      // when
      account.changePassword(updatePassword);
      await accountRepository.save(account);

      // then
      const isRightPassword = await bcrypt.compareSync(
        updatePassword,
        account.password,
      );
      expect(isRightPassword).toBe(true);
    });
  });

  describe('find', () => {
    it('id로 Account를 검색한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      // when
      const findAccount = await accountQueryRepository.findOneById(account.id);

      // then
      expect(findAccount).toMatchObject(account);
    });

    it('email로 Account를 검색한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      // when
      const findAccount = await accountQueryRepository.findOneByEmail(
        account.email,
      );

      // then
      expect(findAccount).toMatchObject(account);
    });
  });

  describe('remove', () => {
    it('id로 Account를 삭제한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');
      const account = Account.of(email, phone, password);

      await accountRepository.save(account);
      // when
      await accountRepository.softRemove(account);

      const findAccount = await accountQueryRepository.findOneById(account.id);

      // then
      expect(findAccount).toBeNull();
    });
  });
});
