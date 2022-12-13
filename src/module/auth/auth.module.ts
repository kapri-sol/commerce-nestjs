import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountModule } from '../account/account.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [AccountModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
