import { JwtHeader, JwtPayload } from 'jwt-decode';
import pickBy from 'lodash/pickBy';
import { JwtAccessTokenInterface } from '../contracts/token';
import AbstractToken from './AbstractToken';

const publicClaims = [
  'ace_profile',
  'acr',
  'act',
  'address',
  'amr',
  'at_hash',
  'at_use_nbr',
  'attest',
  'aud',
  'auth_time',
  'azp',
  'birthdate',
  'c_hash',
  'client_id',
  'cnf',
  'cnonce',
  'dest',
  'div',
  'email',
  'email_verified',
  'entitlements',
  'events',
  'exi',
  'exp',
  'family_name',
  'gender',
  'given_name',
  'groups',
  'iat',
  'iss',
  'jcard',
  'jti',
  'locale',
  'may_act',
  'middle_name',
  'mky',
  'name',
  'nbf',
  'nickname',
  'nonce',
  'opt',
  'orig',
  'origid',
  'phone_number',
  'phone_number_verified',
  'picture',
  'preferred_username',
  'profile',
  'roles',
  'rph',
  'scope',
  'sid',
  'sip_callid',
  'sip_cseq_num',
  'sip_date',
  'sip_from_tag',
  'sip_via_branch',
  'sph',
  'sub',
  'sub_jwk',
  'toe',
  'token_introspection',
  'txn',
  'updated_at',
  'vc',
  'vot',
  'vp',
  'vtm',
  'website',
  'zoneinfo',
];

export default class JwtAccessToken extends AbstractToken implements JwtAccessTokenInterface {
  private _header: JwtHeader = {};
  private _claims: JwtPayload & Record<string, any> = {};

  public getHeader (): JwtHeader {
    return this._header;
  }

  public setHeader (header: JwtHeader): void {
    this._header = header;
  }

  public getIss (): JwtPayload['iss'] {
    return this._claims.iss;
  }

  public getSub (): JwtPayload['sub'] {
    return this._claims.sub;
  }

  public getAud (): JwtPayload['aud'] {
    return this._claims.aud;
  }

  public getExp (): JwtPayload['exp'] {
    return this._claims.exp;
  }

  public getNbf (): JwtPayload['nbf'] {
    return this._claims.nbf;
  }

  public getIat (): JwtPayload['iat'] {
    return this._claims.iat;
  }

  public getJti (): JwtPayload['jti'] {
    return this._claims.jti;
  }

  public getPublicClaims<T = Record<string, any>> (): JwtPayload & T {
    return pickBy(this._claims, (value, key) => publicClaims.includes(key)) as JwtPayload & T;
  }

  public getPrivateClaims<T = Record<string, any>> (): JwtPayload & T {
    return pickBy(this._claims, (value, key) => !publicClaims.includes(key)) as JwtPayload & T;
  }

  public getClaims<T = Record<string, any>> (): JwtPayload & T {
    return this._claims as JwtPayload & T;
  }

  public setClaims (claims: JwtPayload & Record<string, any>): void {
    this._claims = claims;
  }

  public isExpired (): boolean {
    const expires = this.getExp();

    if (!expires) {
      return true;
    }

    return expires < new Date().getTime() / 1000;
  }

  public isValid (): boolean {
    return !this.isExpired();
  }
}
