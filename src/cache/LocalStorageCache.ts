import AbstractCache, { AbstractCacheOptions } from './AbstractCache';

export type LocalStorageCacheOptions = AbstractCacheOptions;

export default class LocalStorageCache extends AbstractCache {

  public constructor (options?: LocalStorageCacheOptions) {
    super(options);
  }

  protected async _doAllKeys (prefix: string): Promise<string[]> {
    return Object.keys(window.localStorage).filter(key =>
      key.startsWith(prefix),
    );
  }

  protected async _doGet<T> (key: string): Promise<T | null> {
    let mValue = localStorage.getItem(key);

    if (mValue === null) {
      return null;
    }

    try {
      return JSON.parse(mValue) as T;
    } catch (e) {
      return null;
    }
  }

  protected async _doRemove (key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  protected async _doSet (key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
