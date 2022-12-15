import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SessionAuthGuard } from '@src/guard/session-auth.guard';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create.dto';
import {
  CreateAccountResponseDto,
  FindAccountResponseDto,
} from './dto/response.dto';
import { UpdateAccountDto } from './dto/update.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 계정을 id로 검색한다.
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<FindAccountResponseDto>}
   * @memberof AccountController
   */
  @Get()
  @UseGuards(SessionAuthGuard)
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  async findAccount(@Session() session): Promise<FindAccountResponseDto> {
    const { email, phone } = await this.accountService.findAccountById(
      BigInt(session.account.id),
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
   * @return {*}  {Promise<CreateAccountResponseDto>}
   * @memberof AccountController
   */
  @Post()
  async createAccount(
    @Body()
    createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseDto> {
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
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  async updateAccount(
    @Session() session,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    await this.accountService.updateAccount(
      BigInt(session.id),
      updateAccountDto,
    );
  }

  /**
   * 계정을 삭제한다.
   *
   * @param {bigint} accountId
   * @memberof AccountController
   */
  @Delete()
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  async removeAccount(@Session() session) {
    await this.accountService.deleteAccountById(BigInt(session.id));
  }
}
