import AuthenticationException from './AuthenticationException';

export default class LoginFailedException extends AuthenticationException {
  constructor (message: string = 'An authentication exception occurred.') {
    super(message);
  }
}
