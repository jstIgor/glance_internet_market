import { Injectable } from '@nestjs/common';
import { baseOauthService } from './base-oAuth.service';
import { BaseProviderType } from './types/base-provider.type';

@Injectable()
export class GoogleProviderService extends baseOauthService {
  constructor(options: BaseProviderType) {
    super({
      name: 'google',
      auth_url: 'https://accounts.google.com/o/oauth2/auth',
      access_url: 'https://oauth2.googleapis.com/token',
      profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scopes: options.scopes,
      client_id: options.client_id,
      client_secret: options.client_secret,
    });
  }

  public extractUserInfo(user: {
    sub: string;
    email: string;
    name: string;
    picture: string;
    locale: string;
    verified_email: boolean;
  }) {
    return super.extractUserInfo({
      email: user.email,
      name: user.name,
      picture: user.picture,
    })
  }
}