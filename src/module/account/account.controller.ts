import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionAuthGuard } from '@src/guard/session-auth.guard';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create.dto';
import { FindAccountResponse } from './response/find.response';
import { UpdateAccountDto } from './dto/update.dto';
import { CreateAccountResponse } from './response/create.response';
import { SessionAccountId } from '@src/decorator/account-id.decorator';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 계정 정보를 검색한다.
   *
   * @param {*} session
   * @return {*}  {Promise<FindAccountResponse>}
   * @memberof AccountController
   */
  @Get()
  @UseGuards(SessionAuthGuard)
  async findAccount(
    @SessionAccountId() accountId: bigint,
  ): Promise<FindAccountResponse> {
    const { email, phone } = await this.accountService.findAccountById(
      accountId,
    );

    return {
      email,
      phone,
    };
  }

  /**
   * 계정을 생성한다.
   *
   * @param {CreateAccountDto} createAccountDto
   * @return {*}  {Promise<CreateAccountResponse>}
   * @memberof AccountController
   */
  @Post()
  async createAccount(
    @Body()
    createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponse> {
    const accountId = await this.accountService.createAccount(createAccountDto);

    return {
      id: accountId.toString(),
    };
  }

  /**
   * 계정 정보를 수정한다.
   *
   * @param {bigint} accountId
   * @param {UpdateAccountDto} updateAccountDto
   * @memberof AccountController
   */
  @Patch()
  async updateAccount(
    @SessionAccountId() accountId: bigint,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    await this.accountService.updateAccount(accountId, updateAccountDto);
  }

  /**
   * 계정을 삭제한다.
   *
   * @param {bigint} accountId
   * @memberof AccountController
   */
  @Delete()
  async removeAccount(@SessionAccountId() accountId: bigint) {
    await this.accountService.deleteAccountById(accountId);
  }
}
