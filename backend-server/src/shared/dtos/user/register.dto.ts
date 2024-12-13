import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthMethod } from 'prisma/__generated__/default';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  method?: AuthMethod;
}