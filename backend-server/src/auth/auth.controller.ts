import { Controller, Patch, Post, Put, Req, Res, UsePipes, ValidationPipe, Param, Get, Query, Redirect, UnauthorizedException, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "src/shared/dtos/user/register.dto";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "./guards/auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('register')
  public async register(@Req() req: Request, @Body() dto: RegisterUserDto) {
    return this.authService.register(req, dto)
  }

  @Post('login')
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.authService.login(req, dto)
  }
  
  @UseGuards(AuthGuard)
  @Patch('logout')
  public async logout(@Req() req: Request, @Res({passthrough:true}) res: Response) {
    return this.authService.logout(req, res)
  }

  @Post('send-verification')
  async sendVerification(@Req() req: Request) {
    return this.authService.sendVerificationEmail(req.session.userId);
  }

  @Post('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

}