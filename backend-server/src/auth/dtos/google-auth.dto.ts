import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export interface GoogleUserData {
  email: string;
  name: string;
  picture?: string;
} 