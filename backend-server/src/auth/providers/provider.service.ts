import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER_OPTIONS, TypeOptions } from './provider.constants';

@Injectable()
export class ProviderService {
  constructor(
    @Inject(PROVIDER_OPTIONS)
    private readonly options: TypeOptions,
  ) {}

  getAuthUrl(provider: string): string {
    const service = this.options.services.find(
      (s) => s.constructor.name === `${provider}ProviderService`,
    );
    if (!service) {
      throw new Error(`Provider ${provider} not found`);
    }
    return service.getAuthUrl();
  }

  async getTokenFromCode(provider: string, code: string): Promise<any> {
    const service = this.options.services.find(
      (s) => s.constructor.name === `${provider}ProviderService`,
    );
    if (!service) {
      throw new Error(`Provider ${provider} not found`);
    }
    return service.getTokenFromCode(code);
  }

  async getUserData(provider: string, token: string): Promise<any> {
    const service = this.options.services.find(
      (s) => s.constructor.name === `${provider}ProviderService`,
    );
    if (!service) {
      throw new Error(`Provider ${provider} not found`);
    }
    return service.getUserData(token);
  }
}
