import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountModule } from '@src/module/account/account.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Account } from '@src/entity/account.entity';
import { Customer } from '@src/entity/customer.entity';
import { AccountRepository } from '@src/module/account/account.repository';
import { AppModule } from '@src/app.module';
import * as session from 'express-session';
import { sessionConfig } from '@src/config/session.config';
import { find } from '@fxts/core';

describe('Account e2e', () => {
  let app: INestApplication;
  let databaseSource: DataSource;
  let accountRepository: AccountRepository;

  const createAccount = () => {};

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
    accountRepository = module.get<AccountRepository>(AccountRepository);

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

  it('/account (GET)', async () => {
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

  it('/accounts (POST)', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const phone = faker.phone.number('+82 10-####-####');

    const response = await request(app.getHttpServer()).post('/account').send({
      email,
      password,
      phone,
    });

    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.body).toStrictEqual({
      id: expect.any(String),
    });

    const account = await accountRepository.findOneById(
      BigInt(response.body.id),
    );

    expect(account.email).toBe(email);
    expect(account.phone).toBe(phone);
  });

  it('/accounts (PATCH)', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const phone = faker.phone.number('+82 10-####-####');

    const account = Account.of(email, phone, password);
    await accountRepository.save(account);

    const updatePassword = faker.internet.password();
    const updatePhone = faker.phone.number('+82 10-####-####');

    const authCookie = await login(email, password);

    const response = await request(app.getHttpServer())
      .patch('/account')
      .set('Cookie', authCookie)
      .send({
        phone: updatePhone,
        password: updatePassword,
      });

    const updateAccount = await accountRepository.findOneById(account.id);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(updateAccount.phone).toBe(updatePhone);
  });

  it('/accounts (DELETE)', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const phone = faker.phone.number('+82 10-####-####');

    const account = Account.of(email, phone, password);
    await accountRepository.save(account);

    const authCookie = await login(email, password);

    const response = await request(app.getHttpServer())
      .delete('/account')
      .set('Cookie', authCookie);

    const deleteAccount = await accountRepository.findOneById(account.id);

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(deleteAccount).toBeNull();
  });
});
