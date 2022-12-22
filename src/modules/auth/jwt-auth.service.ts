import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccountService } from '../account/account.service';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthService implements AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAccount(email: string, password: string) {
    const account = await this.accountService.findAccountByEmail(email);

    const validateResult = await account?.validatePassword(password);

    return validateResult
      ? {
          id: account.id.toString(),
        }
      : null;
  }

  async login(request: any) {
    const account = request.account;
    const payload = { email: account.email, sub: account.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
