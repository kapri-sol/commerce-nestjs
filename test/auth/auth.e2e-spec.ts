import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Account } from '@src/entity/account.entity';
import { Customer } from '@src/entity/customer.entity';
import { AccountRepository } from '@src/module/account/account.repository';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { AuthModule } from '@src/module/auth/auth.module';
import * as session from 'express-session';
import { sessionConfig } from '@src/config/session.config';

describe('', () => {
  let app: INestApplication;
  let databaseSource: DataSource;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AuthModule],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    databaseSource = module.get<DataSource>(DataSource);
    accountRepository = module.get<AccountRepository>(AccountRepository);

    app.use(session(sessionConfig));

    await app.init();
  });

  afterAll(async () => {
    await databaseSource.destroy();
  });

  afterEach(async () => {
    await databaseSource.transaction(async (entityManager) => {
      await entityManager.query('SET FOREIGN_KEY_CHECKS = 0');
      await entityManager.getRepository(Customer).clear();
      await entityManager.getRepository(Account).clear();
      await entityManager.query('SET FOREIGN_KEY_CHECKS = 1');
    });
  });

  describe('/auth/login', () => {
    it('로그인', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);

      await accountRepository.save(account);

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        });

      // then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(
        response.headers['set-cookie'].find((cookie: string) =>
          cookie.startsWith('auth'),
        ),
      ).toBeTruthy();
    });

    it('잘못된 패스워드를 입력했을 경우', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);

      await accountRepository.save(account);

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password: `${password}123`,
        });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
