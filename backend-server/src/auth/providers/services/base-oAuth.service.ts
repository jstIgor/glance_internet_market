import { Injectable } from '@nestjs/common';
import { BaseProviderConfig } from './types/base-provider.type';

@Injectable()
export abstract class BaseOAuthService {
  protected constructor(protected readonly config: BaseProviderConfig) {}

  protected getRedirectUri(): string {
    return this.config.redirect_uri;
  }

  protected getClientId(): string {
    return this.config.client_id;
  }

  protected getClientSecret(): string {
    return this.config.client_secret;
  }

  protected getScopes(): string[] {
    return this.config.scopes;
  }

  protected extractUserInfo(user: {
    email: string;
    name: string;
    picture?: string;
  }) {
    return {
      email: user.email,
      name: user.name,
      picture: user.picture,
    };
  }
}