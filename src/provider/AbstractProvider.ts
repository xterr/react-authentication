import { CacheInterface } from '../contracts/cache';
import { ProviderInterface } from '../contracts/provider';
import { JwtAccessTokenInterface, RefreshTokenInterface } from '../contracts/token';
import { MissingRequiredOptionException } from '../exception';

export type AbstractProviderOptions = {
  cache?: CacheInterface,
};

export default abstract class AbstractProvider implements ProviderInterface {
  private readonly _options?: Record<string, unknown>;

  public constructor (options?: AbstractProviderOptions) {
    this._options = options;
  }

  public abstract login (options: Record<string, unknown>): Promise<void>;

  public abstract logout (): Promise<void>;

  public abstract initialize (): Promise<void>;

  public abstract isAuthenticated (): boolean;

  public abstract getAccessToken (): JwtAccessTokenInterface | null;

  public abstract getRefreshToken (): RefreshTokenInterface | null;

  public supportsRefresh (): boolean {
    return false;
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
