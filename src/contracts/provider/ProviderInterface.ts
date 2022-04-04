import { LoginOptions } from '../../types';

export default interface ProviderInterface {
  login (options: LoginOptions): Promise<void>;

  logout (): Promise<void>;

  initialize (): Promise<void>;

  isAuthenticated (): boolean;

  hasAccessToken (): boolean;

  hasRefreshToken (): boolean;
}
