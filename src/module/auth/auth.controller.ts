import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@src/guard/local-auth.guard';
import { instanceToPlain } from 'class-transformer';
import { LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @Post('login')
  login(@Request() req) {
    req.session.account = instanceToPlain(req.account);
    console.log(req.session.account);
  }
}
