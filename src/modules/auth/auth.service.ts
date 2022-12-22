import { Request } from 'express';

export interface AuthService {
  validateAccount(email: string, password: string);

  login(request: Request);
}
