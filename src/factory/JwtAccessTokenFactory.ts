import jwtDecode, { JwtHeader, JwtPayload } from 'jwt-decode';
import { FactoryInterface } from '../contracts/factory';
import { JwtAccessTokenInterface } from '../contracts/token';

import { TokenValidatorInterface } from '../contracts/validator';
import { JwtDecodeFailureException } from '../exception';
import { JwtAccessToken } from '../token';
import { JwtAccessTokenValidator } from '../validator';

export default class JwtAccessTokenFactory implements FactoryInterface<JwtAccessTokenInterface> {
  constructor (private readonly validator?: TokenValidatorInterface) {
    this.validator = this.validator ?? new JwtAccessTokenValidator();
  }

  public create (token: string): JwtAccessTokenInterface {
    let decodedPayload: JwtPayload;
    let decodedHeader: JwtHeader;

    try {
      decodedHeader = jwtDecode<JwtHeader>(token, { header: true });
      decodedPayload = jwtDecode<JwtPayload>(token);
    } catch (e: any) {
      throw new JwtDecodeFailureException(JwtDecodeFailureException.INVALID_TOKEN, e.message, token);
    }

    const oToken = new JwtAccessToken(token);
    oToken.setHeader(decodedHeader);
    oToken.setClaims(decodedPayload);

    this.validator?.validate(oToken);

    return oToken;
  }
}
