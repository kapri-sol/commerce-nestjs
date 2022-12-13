import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ParseBigintPipe } from '@src/pipe/parse-bigint.pipe';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create.dto';
import {
  CreateAccountResponseDto,
  FindAccountResponseDto,
} from './dto/response.dto';
import { UpdateAccountDto } from './dto/update.dto';

@ApiTags('Account')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 계정을 id로 검색한다.
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<FindAccountResponseDto>}
   * @memberof AccountController
   */
  @Get(':accountId')
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  async findAccount(
    @Param('accountId', ParseBigintPipe) accountId: bigint,
  ): Promise<FindAccountResponseDto> {
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
  @Patch(':accountId')
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  async updateAccount(
    @Param('accountId', ParseBigintPipe) accountId: bigint,
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
  @Delete(':accountId')
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  async removeAccount(@Param('accountId', ParseBigintPipe) accountId: bigint) {
    await this.accountService.deleteAccountById(accountId);
  }
}
