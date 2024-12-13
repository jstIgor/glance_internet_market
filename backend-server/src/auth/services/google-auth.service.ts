import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleUserData } from '../dtos/google-auth.dto';

@Injectable()
export class GoogleAuthService {
  private google: OAuth2Client;

  constructor(private readonly configService: ConfigService) {  
    const redirectUri = `${this.configService.get('APP_URL')}/api/auth/google/callback`;
    console.log('Redirect URI:', redirectUri); // Для отладки
    
    this.google = new OAuth2Client({
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri,
    });
  }

  // Генерация URL для OAuth2 авторизации
  async getGoogleAuthURL(): Promise<string> {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.google.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
      prompt: 'consent',
    });
  }

  // Обработка кода авторизации и получение токена
  async getTokenFromCode(code: string): Promise<GoogleUserData> {
    try {
      const { tokens } = await this.google.getToken(code);
      const ticket = await this.google.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }

  async validateToken(token: string): Promise<GoogleUserData> {
    try {
      const ticket = await this.google.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      return {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
} 