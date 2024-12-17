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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailService: EmailService,
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

  private async saveSession(req: Request, user: any) {
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

  async sendVerificationEmail(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException();

    const token = crypto.randomBytes(32).toString('hex');
    await this.userService.updateVerificationToken(userId, token);

    await this.emailService.sendVerificationEmail(user.email, token);
  }

  async verifyEmail(token: string) {
    const user = await this.userService.findUserByVerificationToken(token);
    if (!user) throw new NotFoundException('Invalid verification token');

    await this.userService.verifyUser(user.id);
    return { message: 'Email verified successfully' };
  }
}

