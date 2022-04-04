export default class JwtDecodeFailureException extends Error {
  public static INVALID_TOKEN = 'invalid_token';

  public static UNVERIFIED_TOKEN = 'unverified_token';

  public static EXPIRED_TOKEN = 'expired_token';

  constructor (private readonly reason: string, message: string, private readonly payload?: string) {
    super(message);
  }

  public getPayload (): string | undefined {
    return this.payload;
  }

  public getReason (): string {
    return this.reason;
  }
}
