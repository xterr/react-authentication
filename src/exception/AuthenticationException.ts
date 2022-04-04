export default class AuthenticationException extends Error {
  constructor (message: string = 'An authentication exception occurred.', protected readonly token?: string) {
    super(message);
  }

  public getToken (): string | undefined {
    return this.token;
  }
}
