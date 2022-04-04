import AuthenticationException from './AuthenticationException';

export default class ExpiredTokenException extends AuthenticationException {
  constructor (message: string = 'Expired Jwt Token', protected readonly token?: string) {
    super(message);
  }
}
