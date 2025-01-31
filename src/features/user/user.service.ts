import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { HandleDBExceptions, HashPassword } from 'src/common/helpers';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create({ password, ...createUserDto }: CreateUserDto) {
    const hash = await HashPassword(password);

    const user = this.userRepository.create({
      password: hash,
      ...createUserDto,
    });

    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: User) {
    if (id !== user.id)
      throw new UnauthorizedException(
        'You are not allowed to update this user',
      );

    try {
      const updatedUser = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async remove(id: string, user: User) {
    if (id !== user.id && user.role !== 'admin')
      throw new UnauthorizedException(
        'You are not allowed to update this user',
      );

    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new BadRequestException('User not found');
      }
      await this.userRepository.softRemove(user);

      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }
}
