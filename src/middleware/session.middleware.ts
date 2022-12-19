import { NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';

export class SessionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    session({
      name: 'auth',
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
    })(req, res, next);
  }
}
