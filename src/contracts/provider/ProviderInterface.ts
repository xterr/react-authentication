import { LoginOptions } from '../../types';
import { JwtAccessTokenInterface, RefreshTokenInterface } from '../token';

export default interface ProviderInterface {
  login (options: LoginOptions): Promise<void>;

  logout (): Promise<void>;

  initialize (): Promise<void>;

  isAuthenticated (): boolean;

  supportsRefresh (): boolean;

  getAccessToken (): JwtAccessTokenInterface | null;

  getRefreshToken (): RefreshTokenInterface | null;
}
