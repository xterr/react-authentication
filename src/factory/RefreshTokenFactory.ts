import { FactoryInterface } from '../contracts/factory';
import { RefreshToken } from '../token';

export default class RefreshTokenFactory implements FactoryInterface<RefreshToken> {
  public create (token: string): RefreshToken {
    return new RefreshToken(token);
  }
}
