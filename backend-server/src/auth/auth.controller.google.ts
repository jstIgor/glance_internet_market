import { Controller, Get, Post, Query, Body, Redirect, Req, UnauthorizedException, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { GoogleAuthDto } from './dtos/google-auth.dto';

@Controller('api/auth/google')
export class AuthGoogleController {
  constructor(private readonly authService: AuthService) { }
  @Post()
  async googleAuth(@Req() req: Request, @Body() dto: GoogleAuthDto) { // Тут сервер получает токен от гугла => клиента и проверяет его
    return this.authService.googleAuth(dto, req);
  }

  @Get('login') // Тут клиент перенапрявляется в руки гугла для авторизации
  @Redirect()
  async googleLogin() {
    const url = await this.authService.getGoogleAuthURL();
    return { url };
  }

  @Get('callback') // Тут гугл перенапрявляет клиента в руки сервера для получения токена => редирект на фронтенд
  @Redirect()
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Req() req: Request
  ) {
    if (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
    return this.authService.handleGoogleCallback(code, req);
  }
}