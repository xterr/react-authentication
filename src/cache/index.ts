import { CacheInterface } from '../contracts/cache';
import InMemoryCache, { InMemoryCacheOptions } from './InMemoryCache';
import LocalStorageCache, { LocalStorageCacheOptions } from './LocalStorageCache';

export const availableCaches = [
  InMemoryCache,
  LocalStorageCache,
] as const;
export type CacheOptions =
  InMemoryCacheOptions
  | LocalStorageCacheOptions
  | Record<string, never>
  ;
export type CacheTypes = typeof availableCaches[number] | (new (...args: any[]) => CacheInterface);

export { LocalStorageCache, InMemoryCache };
