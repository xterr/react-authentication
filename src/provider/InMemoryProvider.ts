import AbstractProvider from './AbstractProvider';

export default class InMemoryProvider extends AbstractProvider {
  private _isAuthenticated = false;

  public initialize (): Promise<void> {
    return Promise.resolve(undefined);
  }

  public isAuthenticated (): boolean {
    return this._isAuthenticated;
  }

  public login (): Promise<void> {
    this._isAuthenticated = true;
    return Promise.resolve(undefined);
  }

  public logout (): Promise<void> {
    this._isAuthenticated = false;
    return Promise.resolve(undefined);
  }
}
