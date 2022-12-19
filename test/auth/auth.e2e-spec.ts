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

    // app.use(
    //   session({
    //     name: 'auth',
    //     secret: 'my-secret',
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: {
    //       httpOnly: true,
    //     },
    //   }),
    // );
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
      const email = faker.internet.email();
      const password = faker.internet.password();
      const phone = faker.phone.number('+82 10-####-####');

      const account = Account.of(email, phone, password);

      await accountRepository.save(account);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          password,
        });

      expect(response.statusCode).toBe(HttpStatus.OK);
      console.log(response.headers);
    });
  });
});
