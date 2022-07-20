import AuthenticationException from './AuthenticationException';

export default class RefreshTokenFailedException extends AuthenticationException {
  constructor (message: string = 'Refresh Token exception occurred.') {
    super(message);
  }
}
