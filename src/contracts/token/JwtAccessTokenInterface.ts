import { JwtHeader, JwtPayload } from 'jwt-decode';
import TokenInterface from './TokenInterface';

export default interface JwtAccessTokenInterface extends TokenInterface {
  isValid (): boolean;

  getHeader (): JwtHeader;

  setHeader (header: JwtHeader): void;

  getIss (): JwtPayload['iss'];

  getSub (): JwtPayload['sub'];

  getAud (): JwtPayload['aud'];

  getExp (): JwtPayload['exp'];

  getNbf (): JwtPayload['nbf'];

  getIat (): JwtPayload['iat'];

  getJti (): JwtPayload['jti'];

  getPublicClaims<T = Record<string, unknown>> (): JwtPayload & T;

  getPrivateClaims<T = Record<string, unknown>> (): JwtPayload & T;

  getClaims<T = Record<string, any>> (): JwtPayload & T;

  setClaims (claims: JwtPayload & Record<string, any>): void;

  isExpired (): boolean;
}
