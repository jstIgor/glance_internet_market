import { BadRequestException, Injectable, InternalServerErrorException, Req, Res } from '@nestjs/common';
import { RegisterUserDto } from '../shared/dtos/user/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthMethod, User } from 'prisma/__generated__';
import { Request } from 'express';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService
  ) { }

  public async register(req:Request, dto: RegisterUserDto) {
    const user = await this.userService.createUser(dto)
    return this.saveSession(req,user)
  }
  public async login(req:Request, res:Response) {
    
   }
  // public async logout() { }

  private async saveSession(@Req() req: Request, user: User) {
    return new Promise((resolve, reject) => {

      // сбрасываем сессию, т.к можно иметь несколько аккаунтов на одном девайсе
      req.session.regenerate((err)=>{
        if(err){
          return reject(new InternalServerErrorException(`Ошибка при сбросе сессии: ${err.message}`))
        } 
      })
      req.session.userId = user.id
      req.session.save((err) => {
        if (err) {
          return reject(new InternalServerErrorException(`Ошибка сохранения сессии: ${err.message}`))
        }
        resolve(
          { user }
        )
      })
    })
  }
}

