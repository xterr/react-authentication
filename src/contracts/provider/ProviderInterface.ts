import { JwtAccessTokenInterface, RefreshTokenInterface } from '../token';

export default interface ProviderInterface {
  login (options: Record<string, unknown>): Promise<void>;

  logout (): Promise<void>;

  initialize (): Promise<void>;

  isAuthenticated (): boolean;

  supportsRefresh (): boolean;

  getAccessToken (): JwtAccessTokenInterface | null;

  getRefreshToken (): RefreshTokenInterface | null;
}
