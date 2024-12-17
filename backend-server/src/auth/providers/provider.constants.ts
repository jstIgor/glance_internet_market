import { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import { BaseProviderType } from "./services/types/base-provider.type";

export const PROVIDER_OPTIONS_SYMBOL = Symbol();

export type TypeOptions = {
  baseUrl: string;
  services: BaseProviderType[];
}

export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>