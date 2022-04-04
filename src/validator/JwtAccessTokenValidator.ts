import isNumber from 'lodash/isNumber';
import { TokenInterface } from '../contracts/token';
import { TokenValidatorInterface } from '../contracts/validator';
import { BadMethodCallException, ExpiredTokenException, InvalidPayloadException } from '../exception';
import { JwtAccessToken } from '../token';

export default class JwtAccessTokenValidator implements TokenValidatorInterface {
  public validate (token: TokenInterface): void {
    if (!(token instanceof JwtAccessToken)) {
      throw new BadMethodCallException(`Validator "${ this.constructor.name }" doesn't support token of type ${ token.constructor.name }`);
    }

    if (!token.getExp() || !isNumber(token.getExp())) {
      throw new InvalidPayloadException('exp', token.getToken());
    }

    if (token.isExpired()) {
      throw new ExpiredTokenException('Expired Jwt Token', token.getToken());
    }

    return;
  }
}
