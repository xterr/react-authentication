import AuthenticationException from './AuthenticationException';

export default class InvalidPayloadException extends AuthenticationException {
  constructor (invalidKey: string, protected readonly token?: string) {
    super(`Unable to find key "${ invalidKey }" in the token payload.`);
  }
}
