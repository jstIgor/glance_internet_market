import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PROVIDER_OPTIONS } from './provider.constants';
import { ProviderService } from './provider.service';
import { getProvidersConfig } from '../config/providers.config';

@Module({})
export class ProviderModule {
  static forRoot(): DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        {
          provide: PROVIDER_OPTIONS,
          useFactory: async (configService: ConfigService) => {
            return await getProvidersConfig(configService);
          },
          inject: [ConfigService],
        },
        ProviderService,
      ],
      exports: [ProviderService],
      global: true,
    };
  }
}
