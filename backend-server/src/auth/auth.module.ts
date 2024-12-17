import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProviderModule } from './providers/provider.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports:[UserModule, ProviderModule],
  controllers:[AuthController]
})
export class AuthModule {}
