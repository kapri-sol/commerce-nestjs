import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Injectable,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@src/utils/guard/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@ApiTags('Auth')
@Injectable()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req);
  }
}
