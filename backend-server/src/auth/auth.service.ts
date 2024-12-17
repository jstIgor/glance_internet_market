import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Req, Res } from '@nestjs/common';
import { RegisterUserDto } from '../shared/dtos/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthMethod, User } from 'prisma/__generated__';
import { Request, Response } from 'express';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService:ConfigService
  ) { }

  public async register(req:Request, dto: RegisterUserDto) {
    const user = await this.userService.createUser(dto)
    return this.saveSession(req,user)
  }

  public async login(req: Request, dto: LoginDto) {
    try {
      const user = await this.userService.findUserByEmail(dto.email);
      if (!user) {
        throw new NotFoundException("Пользователь не найден");
      }

      const isValidPass = await bcrypt.compare(dto.password, user.password);
      if (!isValidPass) {
        throw new BadRequestException("Неверный пароль");
      }

      return await this.saveSession(req, user);;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async logout(req:Request, res:Response) {
    req.session.destroy((err) => err && new InternalServerErrorException(`Ошибка при удалении сессии: ${err.message}`))
    console.log('sdf')
    res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
    return {message:"Вы успешно вышли из аккаунта"}
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          console.error('Session regenerate error:', regenerateErr);
          return reject(new InternalServerErrorException(`Ошибка регенерации сессии: ${regenerateErr.message}`));
        }

        req.session.userId = user.id;
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save error:', saveErr);
            return reject(new InternalServerErrorException(`Ошибка сохранения сессии: ${saveErr.message}`));
          }
          
          console.log('Session saved successfully:', req.sessionID);
          resolve({ user, sessionId: req.sessionID });
        });
      });
    });
  }
}

