import { Injectable } from '@nestjs/common';
import { BaseProviderConfig, BaseProviderType } from './types/base-provider.type';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleProviderService implements BaseProviderType {
  private oauth2Client: OAuth2Client;
  private config: BaseProviderConfig;

  constructor(config: BaseProviderConfig) {
    this.config = config;
    this.oauth2Client = new OAuth2Client(
      config.client_id,
      config.client_secret,
      config.redirect_uri,
    );
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.config.scopes,
      prompt: 'consent',
    });
  }

  async getTokenFromCode(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async getUserData(token: string): Promise<any> {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken: token,
      audience: this.config.client_id,
    });
    return ticket.getPayload();
  }
}