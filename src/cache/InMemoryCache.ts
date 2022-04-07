import AbstractCache, { AbstractCacheOptions } from './AbstractCache';

export type InMemoryCacheOptions = AbstractCacheOptions;

export default class InMemoryCache extends AbstractCache {
  private readonly _entries: Record<string, unknown> = {};

  protected async _doGet<T> (key: string): Promise<T | null> {
    const cacheEntry = this._entries[ key ] as T;

    if (!cacheEntry) {
      return null;
    }

    return cacheEntry;
  }

  protected async _doRemove (key: string): Promise<void> {
    delete this._entries[ key ];
  }

  protected async _doSet (key: string, value: any): Promise<void> {
    this._entries[ key ] = value;
  }

  protected async _doAllKeys (prefix: string): Promise<string[]> {
    return Object.keys(this._entries);
  }
}
