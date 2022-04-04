import { LoginOptions } from '../types';
import AbstractProvider, { AbstractProviderOptions } from './AbstractProvider';

export type OAuth2ProviderOptions = AbstractProviderOptions;

export default class OAuth2Provider extends AbstractProvider {
  public initialize (): Promise<void> {
    return Promise.resolve(undefined);
  }

  public login (options: LoginOptions): Promise<void> {
    return Promise.resolve(undefined);
  }

  public async logout (): Promise<void> {
    return Promise.resolve(undefined);
  }

  public isAuthenticated (): boolean {
    return false;
  }

  public hasAccessToken (): boolean {
    return false;
  }

  public hasRefreshToken (): boolean {
    return false;
  }
}
