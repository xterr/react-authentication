import { TokenInterface } from '../token';

export default interface TokenValidatorInterface {
  validate (token: TokenInterface): void;
}
