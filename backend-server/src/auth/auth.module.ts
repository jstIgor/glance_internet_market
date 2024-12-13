import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { GoogleAuthService } from './services/google-auth.service';
import { EmailService } from './services/email.service';
import { AuthGoogleController } from './auth.controller.google';

@Module({
  imports: [UserModule],
  controllers: [AuthController, AuthGoogleController],
  providers: [AuthService, GoogleAuthService, EmailService],
})
export class AuthModule {}
