import AbstractGrant from './AbstractGrant';

export default class AuthorizationCodeGrant extends AbstractGrant {
  protected getName (): string {
    return 'authorization_code';
  }

  protected getRequiredRequestParameters (): string[] {
    return [
      'code',
    ];
  }
}
