import { Injectable } from '@nestjs/common';
import { baseOauthService } from './base-oAuth.service';
import { BaseProviderType } from './types/base-provider.type';

@Injectable()
export class YandexProviderService extends baseOauthService {
  constructor(options: BaseProviderType) {
    super({
      name: 'yandex',
      auth_url: 'https://oauth.yandex.ru/authorize',
      access_url: 'https://oauth.yandex.ru/token',
      profile_url: 'https://login.yandex.ru/info?format=json',
      scopes: options.scopes,
      client_id: options.client_id,
      client_secret: options.client_secret,
    });
  }

  public extractUserInfo(user: {
    login: string;
    display_name: string;
    default_avatar_id: string;
  }) {
    return super.extractUserInfo({
      email: user.login,
      name: user.display_name,
      picture: user.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200` : null,
    })
  }
}