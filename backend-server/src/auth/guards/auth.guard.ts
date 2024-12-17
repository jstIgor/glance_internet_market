import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionUser = request.session.userId;
    if (!sessionUser) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    request.user = sessionUser;
    
    return true;
  }
}
