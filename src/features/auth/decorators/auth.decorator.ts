import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './system-roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { Role } from 'src/common/enums/system-role.enum';

export function Auth(role: Role) {
  return applyDecorators(
    Roles(role),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
