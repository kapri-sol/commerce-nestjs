import { Request } from 'express';

export interface AuthService {
  validateAccount(email: string, password: string): Promise<object>;

  login(request: Request);
}
