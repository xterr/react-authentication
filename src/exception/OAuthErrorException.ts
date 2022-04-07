export default class OAuthErrorException extends Error {
  constructor (public error: string, public errorDescription?: string) {
    super(errorDescription || error);
  }
}
