import AuthenticationException from './AuthenticationException';

export default class MissingTokenException extends AuthenticationException {
  constructor (message: string = 'Jwt Token not found') {
    super(message);
  }
}
