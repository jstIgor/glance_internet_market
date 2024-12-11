import { AuthMethod } from 'prisma/__generated__/edge';
import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/shared/dtos/user/register.dto';
interface IUser {
  displayName: string;
  email: string;
  message: string;
  password: string;
  picture: string;
  method: AuthMethod;
  isVerified: boolean;
}

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  public async createUser(data: RegisterUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { email: data.email } })
    if (user) {
      throw new BadRequestException('Пользователь с таким email уже существует')
    }
    const hashedPassword = await bcrypt.hash(data.password, 5)
    const newUser = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
        method: AuthMethod.CREDENTIALS
      }
    })
    return newUser
  }


  public async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email }, include: {
        accounts: true
      }
    })
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }
    return user
  }

  public async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id }, include: {
        accounts: true
      }
    })
    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }
    return user
  }


}
