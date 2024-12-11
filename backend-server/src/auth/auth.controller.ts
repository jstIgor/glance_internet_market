import { Controller, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { RegisterUserDto } from "src/shared/dtos/user/register.dto";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
import { Request } from "express";
@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService){}
  @Post('register')
  public async register(@Req() req:Request,@Body() dto:RegisterUserDto){
    return this.authService.register(req,dto)
  }
}