import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
  }

  async singIn (email: string, pass: string): Promise<{ acess_token: string }> {
    const user = await this.userService.findOne(email);

    const isMatch = bcrypt.compare(pass, <string>user?.password);
    if (!isMatch){
      throw new UnauthorizedException('Senha inválida');
    }

    const payload = { sub: user?.id, email: user?.email };

    return {
      acess_token: await this.jwtService.signAsync(payload),
    }
  }
}
