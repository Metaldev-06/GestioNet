import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/system-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { GetSUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(Role.REGULAR)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Auth(Role.REGULAR)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.REGULAR)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetSUser() user: User,
  ) {
    return this.userService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetSUser() user: User) {
    return this.userService.remove(id, user);
  }
}
