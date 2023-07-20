import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthenticatedUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authenticatedUser = request.user;
    return authenticatedUser.userId;
  },
);
