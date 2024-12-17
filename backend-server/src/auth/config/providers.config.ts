import { ConfigService } from "@nestjs/config";
import { TypeOptions } from "../providers/provider.constants";
import { GoogleProviderService } from "../providers/services/google.provider.service";
import { YandexProviderService } from "../providers/services/yandex.provider.service";

export const getProvidersConfig = async (
  configService: ConfigService,
): Promise<TypeOptions> => ({
  baseUrl: configService.getOrThrow('APPLICATION_URL'),
  services: [
    new GoogleProviderService({
      client_id: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      client_secret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      scopes: ['profile', 'email'],
      redirect_uri: `${configService.getOrThrow('APPLICATION_URL')}/api/auth/google/callback`,
    }),
    new YandexProviderService({
      client_id: configService.getOrThrow('YANDEX_CLIENT_ID'),
      client_secret: configService.getOrThrow('YANDEX_CLIENT_SECRET'),
      scopes: ['login:email', 'login:info'],
      redirect_uri: `${configService.getOrThrow('APPLICATION_URL')}/api/auth/yandex/callback`,
    }),
  ]
});