import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

<<<<<<< HEAD
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionUser = request.session.user;

    if (!sessionUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    // Добавляем пользователя из сессии в request
    request.user = sessionUser;
    
    return true;
=======
    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
      const user = request.session.userId
      
      return !!user
    }
>>>>>>> f827a30 (feat;add google auth)
  }
