import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {
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
}
