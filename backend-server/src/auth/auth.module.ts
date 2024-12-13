import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { GoogleAuthService } from './services/google-auth.service';
import { EmailService } from './services/email.service';
import { AuthGoogleController } from './auth.controller.google';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthController, AuthGoogleController],
  providers: [
    AuthService, 
    GoogleAuthService, 
    EmailService,
    AuthGuard
  ],
})
export class AuthModule {}
