import { Controller, Patch, Post, Put, Req, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { RegisterUserDto } from "src/shared/dtos/user/register.dto";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
import { Request, Response } from "express";
import { ServerResponse } from "http";
import { LoginDto } from "./dtos/login.dto";
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
  
  @Patch('logout')
  public async logout(@Req() req: Request, @Res({passthrough:true}) res: Response) {
    return this.authService.logout(req, res)
  }

}