import { CacheInterface } from '../contracts/cache';
import { ProviderInterface } from '../contracts/provider';
import { ProviderNotSupportedException } from '../exception';
import { availableProviders, ProviderOptions, ProviderTypes } from '../provider';

export default class ProviderFactory {
  private static providers: { [ key: string ]: any } = {};

  public constructor () {
    for (const providerClass of availableProviders) {
      ProviderFactory.register(providerClass);
    }
  }

  public static register (providerClass: ProviderTypes): void {
    ProviderFactory.providers[ providerClass.name ] = providerClass;
  }

  public create (providerClass: ProviderTypes, options?: ProviderOptions, cache?: CacheInterface): ProviderInterface {
    if (typeof ProviderFactory.providers[ providerClass.name ] === 'undefined') {
      throw new ProviderNotSupportedException(
        `Provider "${ providerClass.name }" is not supported. Supported providers are: ` +
        `${ Object.keys(ProviderFactory.providers).join(', ') }
      `);
    }

    return new ProviderFactory.providers[ providerClass.name ](options, cache);
  }
}
