import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import { Account } from '@src/entity/account.entity';
import { NotFoundErorr } from '@src/error/not-found.error';
import { AccountController } from '@src/module/account/account.controller';
import { AccountService } from '@src/module/account/account.service';
import { CreateAccountDto } from '@src/module/account/dto/create.dto';
import { FindAccountResponseDto } from '@src/module/account/dto/response.dto';
import { ParseBigintPipe } from '@src/pipe/parse-bigint.pipe';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { anything, instance, mock, when } from 'ts-mockito';

describe('AccountController', () => {
  let mockedAccountService: AccountService;
  let accountService: AccountService;
  let accountController: AccountController;

  beforeAll(() => {
    mockedAccountService = mock(AccountService);
  });

  beforeEach(() => {
    accountService = instance(mockedAccountService);
    accountController = new AccountController(accountService);
  });

  describe('ParseBigintPipe', () => {
    it('string을 bigint로 변환한다.', () => {
      // given
      const parseBigintPipe = new ParseBigintPipe();

      // when
      const id = parseBigintPipe.transform('1');

      // then
      expect(id).toStrictEqual(expect.any(BigInt));
    });

    it('undefined 값이 들어오면 BadRequestException을 던진다.', () => {
      // given
      const parseBigintPipe = new ParseBigintPipe();

      // when
      const transformToBigint = () => parseBigintPipe.transform(undefined);

      // then
      expect(transformToBigint).toThrowError(BadRequestException);
    });
  });

  describe('findAccount', () => {
    it('계정을 검색한다.', async () => {
      // given
      when(mockedAccountService.findAccountById(anything())).thenResolve(
        plainToInstance(Account, {
          _id: BigInt(1),
          _email: faker.internet.email(),
          _phone: faker.phone.number('+82 10-####-####'),
          _password: faker.internet.password(),
        }),
      );

      // when
      const account: FindAccountResponseDto =
        await accountController.findAccount(BigInt(1));

      // then
      expect(account).toStrictEqual({
        email: expect.any(String),
        phone: expect.any(String),
      });
    });

    it('없는 계정을 검색한다.', async () => {
      // given
      when(mockedAccountService.findAccountById(anything())).thenThrow(
        new NotFoundErorr(),
      );
      // when
      const findAccountById = () => accountController.findAccount(BigInt(2));

      // then
      expect(findAccountById).rejects.toThrowError(NotFoundErorr);
    });
  });

  describe('createAccount', () => {
    it('계정을 생성한다.', async () => {
      // given
      const createAccountDto: CreateAccountDto = plainToInstance(
        CreateAccountDto,
        {
          email: faker.internet.email(),
          phone: faker.phone.number('+82 10-####-####'),
          password: faker.internet.password(),
        },
      );
      when(mockedAccountService.createAccount(anything())).thenResolve(
        BigInt(2),
      );

      // when
      const account = await accountController.createAccount(createAccountDto);

      expect(account.id).toStrictEqual(expect.any(String));
    });

    it('계정 정보가 정확하지 않으면 BadRequestException을 던진다.', async () => {
      // given
      const createAccountDto = plainToInstance(CreateAccountDto, {
        email: faker.internet.email(),
        phone: faker.phone.number('+82 10-####-####'),
      });

      // when
      const validateCreateAccountDto = () =>
        validateOrReject(createAccountDto, {
          forbidUnknownValues: true,
          forbidNonWhitelisted: true,
          whitelist: true,
        });

      // then
      await expect(validateCreateAccountDto).rejects.toThrowError(
        ValidationError,
      );
    });
  });
});
