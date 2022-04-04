import { CacheInterface } from '../contracts/cache';
import { FactoryInterface } from '../contracts/factory';
import { JwtAccessTokenInterface, RefreshTokenInterface } from '../contracts/token';
import { MissingTokenException } from '../exception';
import { JwtAccessTokenFactory, RefreshTokenFactory } from '../factory';
import { JwtAccessToken, RefreshToken } from '../token';
import { LoginOptions } from '../types';
import AbstractProvider from './AbstractProvider';

export type JwtProviderOptions = {};

export type JwtLoginOptions = {
  username: string,
  password: string,
}

export default class JwtProvider extends AbstractProvider {
  private static CACHE_KEY_ACCESS_TOKEN = 'jwt_access_token';
  private static CACHE_KEY_REFRESH_TOKEN = 'jwt_refresh_token';

  private _oAccessToken: JwtAccessTokenInterface | null = null;
  private _oRefreshToken: RefreshTokenInterface | null = null;

  private _oAccessTokenFactory: FactoryInterface<JwtAccessTokenInterface>;
  private _oRefreshTokenFactory: FactoryInterface<RefreshTokenInterface>;

  public constructor (
    options?: JwtProviderOptions,
    cache?: CacheInterface,
    accessTokenFactory?: FactoryInterface<JwtAccessToken>,
    refreshTokenFactory?: FactoryInterface<RefreshToken>,
  ) {
    super(options, cache);

    this._oAccessTokenFactory = accessTokenFactory ?? new JwtAccessTokenFactory();
    this._oRefreshTokenFactory = refreshTokenFactory ?? new RefreshTokenFactory();
  }

  public async initialize (): Promise<void> {
    const sAccessToken = await this._getCache().get<string>(JwtProvider.CACHE_KEY_ACCESS_TOKEN);
    const sRefreshToken = await this._getCache().get<string>(JwtProvider.CACHE_KEY_REFRESH_TOKEN);

    if (!sAccessToken) {
      throw new MissingTokenException();
    }

    this._oAccessToken = this._oAccessTokenFactory.create(sAccessToken);

    if (sRefreshToken) {
      this._oRefreshToken = this._oRefreshTokenFactory.create(sRefreshToken);
    }
  }

  public async login (options: LoginOptions): Promise<void> {
    this._oAccessToken = this._oAccessTokenFactory.create(options.accessToken);
    await this._getCache().set(JwtProvider.CACHE_KEY_ACCESS_TOKEN, options.accessToken);

    if (!options.refreshToken) {
      return;
    }

    this._oRefreshToken = this._oRefreshTokenFactory.create(options.refreshToken);
    await this._getCache().set(JwtProvider.CACHE_KEY_REFRESH_TOKEN, options.refreshToken);
  }

  // public async logins<T extends JwtLoginOptions = JwtLoginOptions> (options: T, requestOptions?: RequestInit, useFormData = false): Promise<void> {
  //   if (this._oAccessToken !== null && this._oAccessToken.isValid()) {
  //     return;
  //   }
  //
  //   const requestInit: RequestInit = merge<RequestInit, RequestInit, RequestInit>(
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //     (this._getOption<RequestInit>('requestOptions', {})) as RequestInit,
  //     requestOptions ?? {},
  //   );
  //
  //   const contentType = (requestInit?.headers as any)[ 'Content-Type' ];
  //
  //   switch (contentType) {
  //     case 'application/json':
  //       requestInit.body = JSON.stringify(options);
  //       break;
  //     case 'application/x-www-form-urlencoded':
  //       requestInit.body = new FormData();
  //
  //       for (const [ optionKey, optionValue ] of Object.entries(options)) {
  //         requestInit.body.append(optionKey, optionValue);
  //       }
  //       break;
  //     default:
  //       throw new RuntimeException('Content Type is not supported');
  //   }
  //
  //   const request = new Request(
  //     new URL(
  //       this._getRequiredOption<string>('loginPath') ?? '',
  //       this._getRequiredOption<string>('baseURI') ?? '',
  //     ).toString(),
  //     requestInit,
  //   );
  //
  //   return fetch(request)
  //     .then(async (response) => {
  //       let payload: Record<string, unknown>;
  //
  //       try {
  //         payload = await response.json();
  //       } catch (e) {
  //         throw new HttpException(response, '', 'Network error');
  //       }
  //
  //       if (response.status < 200 || response.status >= 300) {
  //         if (response.status === 401) {
  //           throw new UnauthorizedException(response, payload);
  //         }
  //
  //         if (response.status === 404) {
  //           throw new NotFoundHttpException(response, payload);
  //         }
  //
  //         throw new HttpException(response, payload);
  //       }
  //
  //       this._oAccessToken = this._oAccessTokenFactory.create(payload[ this._getRequiredOption<string>('tokenProperty') ]);
  //       await this._getCache().set(JwtProvider.CACHE_KEY_ACCESS_TOKEN, payload[ this._getRequiredOption<string>('tokenProperty') ]);
  //
  //       if (typeof payload[ this._getRequiredOption<string>('refreshTokenProperty') ] === 'undefined') {
  //         return;
  //       }
  //
  //       this._oRefreshToken = this._oRefreshTokenFactory.create(payload[ this._getRequiredOption<string>('refreshTokenProperty') ]);
  //       await this._getCache().set(JwtProvider.CACHE_KEY_REFRESH_TOKEN, payload[ this._getRequiredOption<string>('refreshTokenProperty') ]);
  //     });
  // }

  public async logout (): Promise<void> {
    this._oAccessToken = null;
    this._oRefreshToken = null;

    return this._getCache().reset();
  }

  public isAuthenticated (): boolean {
    return this._oAccessToken !== null && this._oAccessToken.isValid();
  }

  public hasRefreshToken () {
    return this._oRefreshToken !== null;
  }

  public hasAccessToken () {
    return this._oAccessToken !== null;
  }

  protected _getCache (): CacheInterface {
    const cache = super._getCache();

    if (!cache) {
      throw new Error(`A cache must be defined for ${ JwtProvider.name }`);
    }

    return cache;
  }
}
