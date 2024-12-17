import { Injectable } from '@nestjs/common';
import { BaseOAuthService } from './base-oAuth.service';
import { BaseProviderConfig, BaseProviderType } from './types/base-provider.type';

@Injectable()
export class YandexProviderService extends BaseOAuthService implements BaseProviderType {
  private readonly AUTH_URL = 'https://oauth.yandex.ru/authorize';
  private readonly TOKEN_URL = 'https://oauth.yandex.ru/token';
  private readonly USER_INFO_URL = 'https://login.yandex.ru/info';

  constructor(config: BaseProviderConfig) {
    super(config);
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.getClientId(),
      redirect_uri: this.getRedirectUri(),
      scope: this.getScopes().join(' '),
    });

    return `${this.AUTH_URL}?${params.toString()}`;
  }

  async getTokenFromCode(code: string): Promise<any> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: this.getClientId(),
      client_secret: this.getClientSecret(),
      redirect_uri: this.getRedirectUri(),
    });

    const response = await fetch(this.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to get token from Yandex');
    }

    return response.json();
  }

  async getUserData(token: string): Promise<any> {
    const response = await fetch(this.USER_INFO_URL, {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data from Yandex');
    }

    const data = await response.json();
    return this.extractUserInfo({
      email: data.default_email,
      name: data.real_name || data.display_name,
      picture: data.default_avatar_id 
        ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
        : undefined,
    });
  }
}