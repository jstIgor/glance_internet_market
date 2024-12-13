import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '../shared/dtos/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthMethod, User } from 'prisma/__generated__';
import { Request, Response } from 'express';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './services/google-auth.service';
import { EmailService } from './services/email.service';
import { GoogleAuthDto } from './dtos/google-auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService:ConfigService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly emailService: EmailService,
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
    res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
    return {message:"Вы успешно вышли из аккаунта"}
  }

  private async saveSession(req: Request, user: User): Promise<{ user: User; sessionId: string }> {
    return new Promise((resolve, reject) => {
      req.session.regenerate((regenerateErr) => {
        if (regenerateErr) {
          return reject(new InternalServerErrorException(`Ошибка регенерации сессии: ${regenerateErr.message}`));
        }

        req.session.userId = user.id;
        
        req.session.save((saveErr) => {
          if (saveErr) {
            return reject(new InternalServerErrorException(`Ошибка сохранения сессии: ${saveErr.message}`));
          }
          
          resolve({ user, sessionId: req.sessionID });
        });
      });
    });
  }

  async googleAuth(dto: GoogleAuthDto, req: Request) { 
    const userData = await this.googleAuthService.validateToken(dto.token);
    
    let user = await this.userService.findUserByEmail(userData.email);
    
    if (!user) {
      user = await this.userService.createUser({
        email: userData.email,
        displayName: userData.name,
        image: userData.picture,
        method: "GOOGLE" as AuthMethod,
        isVerified: true, // Google emails are pre-verified
      });
    }

    return this.saveSession(req, user);
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new UnauthorizedException();

    const token = crypto.randomBytes(32).toString('hex');
    await this.userService.updateVerificationToken(userId, token);
    
    await this.emailService.sendVerificationEmail(user.email, token);
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findUserByVerificationToken(token);
    if (!user) throw new UnauthorizedException('Invalid verification token');

    await this.userService.verifyUser(user.id);
    return { message: 'Email verified successfully' };
  }

  async getGoogleAuthURL() {
    return this.googleAuthService.getGoogleAuthURL();
  }

  async handleGoogleCallback(code: string, req: Request) {
    try {
      const userData = await this.googleAuthService.getTokenFromCode(code);
      let user = await this.userService.findUserByEmail(userData.email);
      
      if (!user) {
        user = await this.userService.createUser({
          email: userData.email,
          displayName: userData.name,
          image: userData.picture,
          method: "GOOGLE" as AuthMethod,
          isVerified: true,
        });
      }

      const session = await this.saveSession(req, user);
      
      return {
        url: `${this.configService.get('FRONTEND_URL')}${this.configService.get('FRONTEND_AUTH_SUCCESS_URL')}?status=success`,
      };
    } catch (error) {
      console.error('Google auth error:', error);
      return {
        url: `${this.configService.get('FRONTEND_URL')}${this.configService.get('FRONTEND_AUTH_ERROR_URL')}?status=error&message=${encodeURIComponent(error.message)}`,
      };
    }
  }
}

