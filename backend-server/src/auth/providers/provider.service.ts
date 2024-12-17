import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PROVIDER_OPTIONS_SYMBOL } from './provider.constants';
import { TypeOptions } from './provider.constants';
import { BaseProviderType } from './services/types/base-provider.type';
@Injectable()
export class ProviderService implements OnModuleInit {
  constructor(
    @Inject(PROVIDER_OPTIONS_SYMBOL) private readonly options: TypeOptions
  ){}

  public onModuleInit(){
    for(const provider of this.options.services){
      provider.baseUrl = this.options.baseUrl
    }
  }

  public findByService(service: string): BaseProviderType | null{
    return this.options.services.find(s => s.name === service)
  }

}
