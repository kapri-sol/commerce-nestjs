import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountModule } from '@src/module/account/account.module';
import { DataSource, Repository } from 'typeorm';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Account } from '@src/entity/account.entity';
import { Customer } from '@src/entity/customer.entity';
import { AccountQueryRepository } from '@src/module/account/account.query-repository';
import { AppModule } from '@src/app.module';
import * as session from 'express-session';
import { sessionConfig } from '@src/config/session.config';
import { find } from '@fxts/core';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Account e2e', () => {
  let app: INestApplication;
  let databaseSource: DataSource;
  let accountRepository: Repository<Account>;
  let accountQueryRepository: AccountQueryRepository;

  const login = async (email: string, password: string) => {
    const cookies: string[] = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .then(({ headers }) => headers['set-cookie']);

    return find((cookie) => cookie.split('=').shift() === 'auth', cookies);
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AccountModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    app.use(session(sessionConfig));
    databaseSource = module.get<DataSource>(DataSource);
    accountRepository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
    accountQueryRepository = module.get<AccountQueryRepository>(
      AccountQueryRepository,
    );

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

  describe('/account (GET)', () => {
    it('계정 정보를 조회한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const authCookie = await login(email, password);

      // when
      const response = await request(app.getHttpServer())
        .get(`/account`)
        .set('Cookie', authCookie)
        .send();

      // then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toStrictEqual({
        email,
        phone,
      });
    });
  });

  describe('/account (POST)', () => {
    it('계정을 생성한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      // when
      const response = await request(app.getHttpServer())
        .post('/account')
        .send({
          email,
          password,
          phone,
        });

      // then
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toStrictEqual({
        id: expect.any(String),
      });

      const account = await accountQueryRepository.findOneById(
        BigInt(response.body.id),
      );

      expect(account.email).toBe(email);
      expect(account.phone).toBe(phone);
    });

    it('이메일 없이, 계정을 생성하면 Bad Request 에러가 발생한다.', async () => {
      // given
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      // when
      const response = await request(app.getHttpServer())
        .post('/account')
        .send({
          password,
          phone,
        });

      // then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('비밀번호 없이, 계정을 생성하면 Bad Request 에러가 발생한다.', async () => {
      // given
      const email = faker.internet.email();
      const phone = faker.phone.number('+82 10-####-####');

      // when
      const response = await request(app.getHttpServer())
        .post('/account')
        .send({
          email,
          phone,
        });

      // then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('휴대폰 번호 없이, 계정을 생성하면 Bad Request 에러가 발생한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();

      // when
      const response = await request(app.getHttpServer())
        .post('/account')
        .send({
          email,
          password,
        });

      // then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('휴대폰 번호가 다른 국가일 경우, 계정을 생성하면 Bad Request 에러가 발생한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+81 10-####-####');

      // when
      const response = await request(app.getHttpServer())
        .post('/account')
        .send({
          email,
          password,
          phone,
        });

      // then
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/account (PATCH)', () => {
    it('계정 정보를 수정한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const updatePassword = faker.internet.password();
      const updatePhone = faker.phone.number('+82 10-####-####');

      const authCookie = await login(email, password);

      // when
      const response = await request(app.getHttpServer())
        .patch('/account')
        .set('Cookie', authCookie)
        .send({
          phone: updatePhone,
          password: updatePassword,
        });

      // then
      const updateAccount = await accountQueryRepository.findOneById(
        account.id,
      );
      const isValidPassword = await updateAccount.validatePassword(
        updatePassword,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(updateAccount.phone).toBe(updatePhone);
      expect(isValidPassword).toBe(true);
    });

    it('휴대폰 번호를 수정한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const updatePhone = faker.phone.number('+82 10-####-####');

      const authCookie = await login(email, password);

      // when
      const response = await request(app.getHttpServer())
        .patch('/account')
        .set('Cookie', authCookie)
        .send({
          phone: updatePhone,
        });

      // then
      const updateAccount = await accountQueryRepository.findOneById(
        account.id,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(updateAccount.phone).toBe(updatePhone);
    });

    it('비밀번호를 수정한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const updatePassword = faker.internet.password();

      const authCookie = await login(email, password);

      // when
      const response = await request(app.getHttpServer())
        .patch('/account')
        .set('Cookie', authCookie)
        .send({
          password: updatePassword,
        });

      // then
      const updateAccount = await accountQueryRepository.findOneById(
        account.id,
      );
      const isValidPassword = await updateAccount.validatePassword(
        updatePassword,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(isValidPassword).toBe(true);
    });

    it('빈 값을 보내면 계정 정보가 수정되지 않는다..', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const authCookie = await login(email, password);

      // when
      const response = await request(app.getHttpServer())
        .patch('/account')
        .set('Cookie', authCookie)
        .send({});
      const updateAccount = await accountQueryRepository.findOneById(
        account.id,
      );
      const isValidPassword = await updateAccount.validatePassword(password);

      // then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(updateAccount.phone).toBe(account.phone);
      expect(isValidPassword).toBe(true);
    });
  });

  describe('/accounts (DELETE)', () => {
    it('계정을 제거한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const authCookie = await login(email, password);

      // when
      const response = await request(app.getHttpServer())
        .delete('/account')
        .set('Cookie', authCookie);

      const deleteAccount = await accountQueryRepository.findOneById(
        account.id,
      );

      // then
      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(deleteAccount).toBeNull();
    });

    it('존재하지 않는 계정을 제거한다.', async () => {
      // given
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);
      await accountRepository.save(account);

      const authCookie = await login(email, password);

      await accountRepository.softRemove(account);

      // when
      const response = await request(app.getHttpServer())
        .delete('/account')
        .set('Cookie', authCookie);

      const deleteAccount = await accountQueryRepository.findOneById(
        account.id,
      );

      // then
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(deleteAccount).toBeNull();
    });
  });
});
