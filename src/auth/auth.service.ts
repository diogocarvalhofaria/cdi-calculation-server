import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { DefaultMessage } from '../cummons/default-message';
import { MailService } from '../communication/mail/service/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('Chave secreta JWT não configurada.');
      }
      const payload = jwt.verify(token, secret) as { userId: number };
      const userId = payload.userId;

      const user = await this.userRepository.findOne({ where: { id: String(userId) } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      if (user.verifiedEmail) {
        console.log('E-mail já havia sido verificado.');
        return;
      }

      user.verifiedEmail = new Date();
      await this.userRepository.save(user);

    } catch (error) {
      throw new BadRequestException('Link de verificação inválido ou expirado.');
    }
  }


  async singIn (email: string, pass: string): Promise<{ acess_token: string }> {
    const user = await this.userService.findOne(email);

    const isMatch = bcrypt.compare(pass, <string>user?.password);
    if (!isMatch){
      throw new UnauthorizedException('Senha inválida');
    }

    if(user.verifiedEmail === null){
      throw new UnauthorizedException('Email não verificado');
    }

    const payload = { sub: user?.id, email: user?.email };

    return {
      acess_token: await this.jwtService.signAsync(payload),
    }
  }

  async forgotPassword(email: string): Promise<DefaultMessage> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    try {
      await this.mailService.sendPasswordResetEmail(
        user.email,
        user.name,
        this.jwtService.sign(
          { userId: user.id },
          { expiresIn: '1h', secret: process.env.JWT_SECRET }
        )
      );
    }catch (emailError) {
      console.error('Erro ao enviar email de verificação:', emailError);
    }

    return new DefaultMessage(200, 'Se você é o dono dessa conta, verifique seu e-mail para redefinir sua senha.')
  }

  // src/auth/auth.service.ts
  async resetPassword(token: string, newPassword: string): Promise<DefaultMessage> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    }
    let payload: any;

    try {
      payload = jwt.verify(token, secret);
    } catch {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return new DefaultMessage(200, 'Senha alterada com sucesso.');
  }
}
