import { ConfigService } from "@nestjs/config";
import { TypeOptions } from "../providers/provider.constants";
import { GoogleProviderService } from "../providers/services/google.provider.service";
export const getProvidersConfig =
  async (configService: ConfigService):
    Promise<TypeOptions> => ({
      baseUrl: configService.getOrThrow('APP_URL'),
      services: [
        new GoogleProviderService({
          client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
          client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
          scopes: ['profile', 'email'],
        }),
      ]
    })