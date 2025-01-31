import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/features/user/entities/user.entity';

export const GetSUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    return ctx.switchToHttp().getRequest().user;
  },
);
