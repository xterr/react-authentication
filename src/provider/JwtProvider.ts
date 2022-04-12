import { CacheInterface } from '../contracts/cache';
import { FactoryInterface } from '../contracts/factory';
import { JwtAccessTokenInterface, RefreshTokenInterface } from '../contracts/token';
import { MissingRequiredOptionException, MissingTokenException } from '../exception';
import { JwtAccessTokenFactory, RefreshTokenFactory } from '../factory';
import { JwtAccessToken, RefreshToken } from '../token';
import { LoginOptions } from '../types';
import AbstractProvider, { AbstractProviderOptions } from './AbstractProvider';

export type JwtProviderOptions = AbstractProviderOptions & {
  accessTokenFactory?: FactoryInterface<JwtAccessToken>,
  refreshTokenFactory?: FactoryInterface<RefreshToken>,
};

export default class JwtProvider extends AbstractProvider {
  private static CACHE_KEY_ACCESS_TOKEN = 'jwt_access_token';
  private static CACHE_KEY_REFRESH_TOKEN = 'jwt_refresh_token';

  private _oAccessToken: JwtAccessTokenInterface | null = null;
  private _oRefreshToken: RefreshTokenInterface | null = null;

  private _oAccessTokenFactory: FactoryInterface<JwtAccessTokenInterface>;
  private _oRefreshTokenFactory: FactoryInterface<RefreshTokenInterface>;

  public constructor (options?: JwtProviderOptions) {
    super(options);

    this._oAccessTokenFactory = options?.accessTokenFactory ?? new JwtAccessTokenFactory();
    this._oRefreshTokenFactory = options?.refreshTokenFactory ?? new RefreshTokenFactory();
  }

  public async initialize (): Promise<void> {
    const sAccessToken = await this._getRequiredOption<CacheInterface>('cache').get<string>(JwtProvider.CACHE_KEY_ACCESS_TOKEN);
    const sRefreshToken = await this._getRequiredOption<CacheInterface>('cache').get<string>(JwtProvider.CACHE_KEY_REFRESH_TOKEN);

    if (!sAccessToken) {
      throw new MissingTokenException();
    }

    this._oAccessToken = this._oAccessTokenFactory.create(sAccessToken);

    if (sRefreshToken) {
      this._oRefreshToken = this._oRefreshTokenFactory.create(sRefreshToken);
    }
  }

  public async login (options: LoginOptions): Promise<void> {
    if (typeof options.accessToken === 'undefined') {
      throw new MissingRequiredOptionException('accessToken');
    }

    this._oAccessToken = this._oAccessTokenFactory.create(options.accessToken);
    await this._getRequiredOption<CacheInterface>('cache').set(JwtProvider.CACHE_KEY_ACCESS_TOKEN, options.accessToken);

    if (!options.refreshToken) {
      return;
    }

    this._oRefreshToken = this._oRefreshTokenFactory.create(options.refreshToken);
    await this._getRequiredOption<CacheInterface>('cache').set(JwtProvider.CACHE_KEY_REFRESH_TOKEN, options.refreshToken);
  }

  public async logout (): Promise<void> {
    this._oAccessToken = null;
    this._oRefreshToken = null;

    return this._getRequiredOption<CacheInterface>('cache').reset();
  }

  public isAuthenticated (): boolean {
    return this._oAccessToken !== null && this._oAccessToken.isValid();
  }

  public supportsRefresh (): boolean {
    return this._oRefreshToken !== null;
  }
}
