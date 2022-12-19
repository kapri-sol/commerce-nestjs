import { NestMiddleware } from '@nestjs/common';
import { sessionConfig } from '@src/config/session.config';
import * as session from 'express-session';

export class SessionMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    session(sessionConfig)(req, res, next);
  }
}
