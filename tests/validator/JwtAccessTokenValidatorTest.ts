import {
  BadMethodCallException,
  ExpiredTokenException,
  InvalidPayloadException,
  JwtAccessTokenValidator,
} from '../../src';
import { TokenInterface } from '../../src/contracts/token';
import JwtAccessToken from '../../src/token/JwtAccessToken';

describe('JwtAccessTokenValidatorTest', () => {
  it('should validate a token and not throw an exception', () => {
    const oToken = new JwtAccessToken();
    oToken.setClaims({
      exp: new Date().getTime() / 1000 + 10,
    } as any);

    const oValidator = new JwtAccessTokenValidator();

    expect(() => oValidator.validate(oToken)).not.toThrow();
  });

  it('should throw exception if token class is not JwtAccessToken', () => {
    const tokenClass = {} as TokenInterface;

    const oValidator = new JwtAccessTokenValidator();
    expect(() => oValidator.validate(tokenClass))
      .toThrow(new BadMethodCallException('Validator "JwtAccessTokenValidator" doesn\'t support token of type Object'));
  });

  it('should throw exception if exp is not defined', () => {
    const oToken = new JwtAccessToken();
    const oValidator = new JwtAccessTokenValidator();

    expect(() => oValidator.validate(oToken)).toThrow(new InvalidPayloadException('exp', ''));
  });

  it('should throw exception if exp is not a number', () => {
    const oToken = new JwtAccessToken();
    oToken.setClaims({
      exp: 'not-a-number',
    } as any);

    const oValidator = new JwtAccessTokenValidator();

    expect(() => oValidator.validate(oToken)).toThrow(new InvalidPayloadException('exp', ''));
  });

  it('should throw exception if token is expired', () => {
    const oToken = new JwtAccessToken();
    oToken.setClaims({
      exp: new Date().getTime() / 1000 - 100,
    } as any);

    const oValidator = new JwtAccessTokenValidator();

    expect(() => oValidator.validate(oToken)).toThrow(new ExpiredTokenException('Expired Jwt Token', ''));
  });
});
