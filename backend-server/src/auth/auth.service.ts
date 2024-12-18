import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './services/email.service';
import { RegisterUserDto } from '../shared/dtos/user/register.dto';
import { LoginDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ProviderService } from './providers/provider.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'prisma/__generated__/edge';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService
  ) {}

  async register(req: Request, dto: RegisterUserDto) {
    const user = await this.userService.createUser(dto);
    return this.saveSession(req, user);
  }

  async login(req: Request, dto: LoginDto) {
    try {
      const user = await this.userService.findUserByEmail(dto.email);
      if (!user) {
        throw new NotFoundException("Пользователь не найден");
      }

      const isValidPass = await bcrypt.compare(dto.password, user.password);
      if (!isValidPass) {
        throw new BadRequestException("Неверный пароль");
      }

      return await this.saveSession(req, user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => err && new InternalServerErrorException(`Ошибка при удалении сессии: ${err.message}`));
    res.clearCookie(this.configService.getOrThrow('SESSION_NAME'));
    return { message: "Вы успешно вышли из аккаунта" };
  }

  private async saveSession(req: Request, user: User) {
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

  private generateUserAccesToken({id, email, role}: User){
    return this.jwtService.sign({id, email, role}, {
      secret: this.configService.getOrThrow('JWT_USER_ACCESS_TOKEN_SECRET'),
      expiresIn: parseInt(this.configService.getOrThrow('JWT_USER_ACCESS_TOKEN_EXPIRATION')),
    })
  }

  async sendVerificationEmail(req: Request) {
    const user = await this.userService.findUserById(req.session.userId)
    if(!user) throw new NotFoundException('User not found');
    if(user.isVerified) throw new BadRequestException('User already verified');
    const token = this.generateUserAccesToken(user);
    await this.emailService.sendVerificationEmail(user.email, token);
  }

  async sendRestorePasswordEmail(email: string) {
    const user = await this.userService.findUserByEmail(email)
    if(!user) throw new NotFoundException('User not found');
    const token = this.generateUserAccesToken(user);
    await this.emailService.sendRestorePasswordEmail(user.email, token);
  }

  async verifyEmail(token: string, req: Request) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_USER_ACCESS_TOKEN_SECRET')
      });
      if(!decoded.id) throw new BadRequestException('Invalid verification token');

      const user = await this.userService.findUserById(decoded.id);
      if (!user) throw new NotFoundException('User not found');
      await this.userService.verifyUser(user.id);

      if(!req.session.userId) {
        await this.saveSession(req, user);
      }

      return { 
        message: 'verified successfully',
        isNewSession: !req.session.userId
      };

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Verification token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid verification token');
      }
      throw error;
    }
  }

  async verifyRestorePassword(token: string, req: Request, {
    password : string
  }) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('JWT_USER_ACCESS_TOKEN_SECRET')
      });
      if(!decoded.id) throw new BadRequestException('Invalid verification token');

      const user = await this.userService.findUserById(decoded.id);
      if (!user) throw new NotFoundException('User not found');

      if(!req.session.userId) {
        await this.saveSession(req, user);
      }

      await this.userService.updateUserPassword(user.id, password)

      return {
        message: 'Password updated successfully'
      }


    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Verification token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid verification token');
      }
      throw error;
    }

  }
}

