import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from '../shared/dtos/user/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: RegisterUserDto) {
    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : null;
    const candidate = await this.findUserByEmail(dto.email)
    if(candidate) {
      throw new BadRequestException("Пользователь с таким email уже существует")
    }
    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        displayName: dto.displayName,
        picture: dto.image,
        isVerified: dto.isVerified || false,
        method: dto.method || "CREDENTIALS",
        accounts: {
          create: [], // Создаем пустой массив аккаунтов
        },
      },
      include: {
        accounts: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });
  }

  async updateVerificationToken(userId: string, token: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verificationToken: token },
    });
  }

  async findUserByVerificationToken(token: string) {
    return this.prisma.user.findFirst({
      where: { verificationToken: token },
      include: {
        accounts: true,
      },
    });
  }

  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
  }
}
