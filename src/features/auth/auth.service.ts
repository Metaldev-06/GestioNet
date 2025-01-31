import { Injectable } from '@nestjs/common';
import { ComparePassword, HandleDBExceptions } from 'src/common/helpers';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly ctxName = 'authSystemUser';

  async login({ email, password }: LoginAuthDto) {
    const user = await this.userService.findOneByEmail(email);

    await ComparePassword(password, user.password);

    return {
      token: this.getJtwToken({ email, role: user.role }),
      user,
    };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    try {
      const user = await this.userService.create(registerAuthDto);
      return {
        token: this.getJtwToken({
          email: user.email,
          role: user.role,
        }),
        user,
      };
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  private getJtwToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
