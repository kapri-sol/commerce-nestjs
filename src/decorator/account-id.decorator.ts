import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionAccountId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return BigInt(request?.session?.account.id);
  },
);
