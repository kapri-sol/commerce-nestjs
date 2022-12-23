import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from '@src/config/jwt.config';
import { AccountModule } from '../account/account.module';
import { AuthController } from './auth.controller';
import { JwtAuthService } from './jwt-auth.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    AccountModule,
    PassportModule.register({
      property: 'account',
    }),
    JwtModule.register({
      secret: jwtConfig.secretOrKey,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthService',
      useClass: JwtAuthService,
    },
    LocalStrategy,
  ],
})
export class AuthModule {}
