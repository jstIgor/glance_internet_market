import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { ProviderModule } from './providers/provider.module';

@Module({
  providers: [AuthService],
  imports:[UserModule, ProviderModule],
  controllers:[AuthController]
})
export class AuthModule {}

