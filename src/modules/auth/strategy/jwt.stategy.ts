import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConfig } from '@src/config/jwt.config';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(jwtConfig);
  }

  validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
