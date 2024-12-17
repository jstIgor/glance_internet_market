import { Module, DynamicModule } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { GoogleProviderService } from './services/google.provider.service';
import { YandexProviderService } from './services/yandex.provider.service';
import { baseOauthService } from './services/base-oAuth.service';
import { PROVIDER_OPTIONS_SYMBOL, TypeAsyncOptions, TypeOptions } from './provider.constants';

@Module({})
export class ProviderModule {
  public static register(options: TypeOptions): DynamicModule {
    return {
      module: ProviderModule,
      providers: [
        { useValue: options.services, provide: PROVIDER_OPTIONS_SYMBOL },
        ProviderService,
      ],
      exports: [
        ProviderService,
      ]
    }
  }
  public static registerAsync(options: TypeAsyncOptions): DynamicModule {
    return {
      module: ProviderModule,
      imports: options.imports,
      providers: [
        { useFactory: options.useFactory, inject: options.inject, provide: PROVIDER_OPTIONS_SYMBOL },
        ProviderService,
      ],
      exports: [
        ProviderService,
      ]
    }
  }
}
