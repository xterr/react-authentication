import { CacheInterface } from '../contracts/cache';
import { ProviderInterface } from '../contracts/provider';
import { MissingRequiredOptionException } from '../exception';
import { LoginOptions } from '../types';

export type AbstractProviderOptions = {};

export default abstract class AbstractProvider implements ProviderInterface {
  private readonly _options: AbstractProviderOptions;
  private readonly _cache?: CacheInterface;

  public constructor (options?: AbstractProviderOptions, cache?: CacheInterface) {
    this._options = options ?? {};
    this._cache = cache;
  }

  public abstract login (options: LoginOptions): Promise<void>;

  public abstract logout (): Promise<void>;

  public abstract initialize (): Promise<void>;

  public abstract isAuthenticated (): boolean;

  public abstract hasAccessToken (): boolean;

  public abstract hasRefreshToken (): boolean;

  protected _getCache (): CacheInterface | null {
    return this._cache ?? null;
  }

  protected _getOptions<T extends AbstractProviderOptions = Record<string, never>> (): T {
    return (this._options ?? {}) as T;
  }

  protected _getOption<T = string | number | boolean> (key: string, defaultValue: T | null = null): T | null {
    return this._getOptions()[ key ] ?? defaultValue;
  }

  protected _getRequiredOption<T> (key: string): T {
    if (typeof this._getOptions()[ key ] === 'undefined' || this._getOptions()[ key ] === '') {
      throw new MissingRequiredOptionException(key);
    }

    return this._getOptions()[ key ] as T;
  }
}
