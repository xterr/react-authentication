import { CacheInterface } from '../contracts/cache';

export type AbstractCacheOptions = {
  prefix?: string,
};

export default abstract class AbstractCache implements CacheInterface {
  private readonly prefix: string = '@@auth_';

  public constructor (options?: AbstractCacheOptions) {
    if (options && options.prefix) {
      this.prefix = options.prefix;
    }
  }

  public async get<T> (key: string, defaultValue: T | null = null): Promise<T | null> {
    return (await this._doGet(this._formatKey(key))) || defaultValue;
  }

  public async set (key: string, value: any): Promise<void> {
    return this._doSet(this._formatKey(key), value);
  }

  public async remove (key: string): Promise<void> {
    return this._doRemove(this._formatKey(key));
  }

  public async reset (): Promise<void> {
    const allKeys = await this.allKeys();

    for (const key of allKeys) {
      await this.remove(key);
    }
  }

  public async allKeys (): Promise<string[]> {
    return (await this._doAllKeys(this.prefix)).map((key) => key.slice(this.prefix.length));
  }

  protected abstract _doGet<T> (key: string): Promise<T | null>;

  protected abstract _doSet (key: string, value: any): Promise<void>;

  protected abstract _doRemove (key: string): Promise<void>;

  protected abstract _doAllKeys (prefix: string): Promise<string[]>;

  private _formatKey (key: string): string {
    return `${ this.prefix }${ key }`;
  }
}
