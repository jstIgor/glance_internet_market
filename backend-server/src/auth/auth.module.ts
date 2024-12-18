import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ProviderModule } from './providers/provider.module';
import { EmailService } from './services/email.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    UserModule,
    ProviderModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    JwtService
  ],
  exports: [AuthService],
})
export class AuthModule {}
