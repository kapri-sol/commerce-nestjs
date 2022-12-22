import { ExtractJwt, StrategyOptions } from 'passport-jwt';

export const jwtConfig: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: 'my-secret',
};
