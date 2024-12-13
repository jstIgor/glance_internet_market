import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { GoogleAuthService } from './services/google-auth.service';
import { EmailService } from './services/email.service';
import { AuthGoogleController } from './auth.controller.google';
<<<<<<< HEAD
import { AuthGuard } from './guards/auth.guard';
=======
>>>>>>> f827a30 (feat;add google auth)

@Module({
  imports: [UserModule],
  controllers: [AuthController, AuthGoogleController],
<<<<<<< HEAD
  providers: [
    AuthService, 
    GoogleAuthService, 
    EmailService,
    AuthGuard
  ],
=======
  providers: [AuthService, GoogleAuthService, EmailService],
>>>>>>> f827a30 (feat;add google auth)
})
export class AuthModule {}
