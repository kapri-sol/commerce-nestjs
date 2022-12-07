import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParseBigintPipe } from '@src/pipe/parse-bigint.pipe';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create.dto';
import {
  CreateAccountResponseDto,
  FindAccountResponseDto,
} from './dto/response.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   *
   *
   * @param {bigint} accountId
   * @return {*}  {Promise<FindAccountResponseDto>}
   * @memberof AccountController
   */
  @Get(':accountId')
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
   *
   *
   * @param {CreateAccountDto} createAccountDto
   * @return {*}  {Promise<CreateAccountResponseDto>}
   * @memberof AccountController
   */
  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<CreateAccountResponseDto> {
    const accountId = await this.accountService.createAccount(createAccountDto);

    return {
      id: accountId.toString(),
    };
  }
}
