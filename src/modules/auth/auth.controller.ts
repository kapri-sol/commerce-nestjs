import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@src/utils/guard/local-auth.guard';
import { LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Request() req) {
    req.session.account = req.account;
  }
}
