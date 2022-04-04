import { TokenInterface } from '../contracts/token';

export default abstract class AbstractToken implements TokenInterface {
  private _token: string = '';

  constructor (token?: string) {
    if (token) {
      this._token = token;
    }
  }

  public getToken (): string {
    return this._token;
  }

  public setToken (token: string): void {
    this._token = token;
  }
}
