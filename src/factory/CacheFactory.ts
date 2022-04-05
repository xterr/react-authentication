import { availableCaches, CacheOptions, CacheTypes } from '../cache';
import { CacheInterface } from '../contracts/cache';
import { CacheNotSupportedException } from '../exception';

export default class CacheFactory {
  private static readonly caches: { [ key: string ]: any } = {};

  public constructor () {
    for (const cacheClass of availableCaches) {
      CacheFactory.register(cacheClass);
    }
  }

  public static register (cacheClass: CacheTypes): void {
    CacheFactory.caches[ cacheClass.name ] = cacheClass;
  }

  public create (cacheClass: CacheTypes, options?: CacheOptions): CacheInterface {
    if (typeof CacheFactory.caches[ cacheClass.name ] === 'undefined') {
      throw new CacheNotSupportedException(
        `Cache "${ cacheClass.name }" is not supported. Supported cache types are:` +
        `${ Object.keys(CacheFactory.caches).join(', ') }`,
      );
    }

    return new CacheFactory.caches[ cacheClass.name ](options);
  }
}
