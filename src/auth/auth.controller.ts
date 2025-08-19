import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Query,
  BadRequestException, Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {
  }

  @Get('verify-email') // Rota: GET /auth/verify-email
  async verifyEmail(
    @Query('token') token: string, // Pega o token da URL, ex: ?token=...
    @Res() res: Response
  ) {
    if (!token) {
      throw new BadRequestException('Token de verificação não fornecido.');
    }
    try {
      await this.authService.verifyEmail(token);

      const frontendLoginUrl = process.env.FRONT_URL + '/login?verified=true';
      return res.redirect(frontendLoginUrl);

    } catch (error) {
      const frontendErrorUrl = process.env.FRONT_URL + '/link-invalido';
      return res.redirect(frontendErrorUrl);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  singIn(@Body() signInDto: { email: string; password: string }) {
    return this.authService.singIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
    @Res() res: Response
  ) {
    if (!email) {
      throw new BadRequestException('E-mail não fornecido.');
    }
    try {
      await this.authService.forgotPassword(email);
      return res.status(HttpStatus.OK).json({ message: 'E-mail de redefinição enviado.' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Res() res: Response
  ) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token ou nova senha não fornecidos.');
    }
    try {
      await this.authService.resetPassword(token, newPassword);
      return res.status(HttpStatus.OK).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
