import AbstractGrant from './AbstractGrant';

export default class RefreshTokenGrant extends AbstractGrant {
  protected getName (): string {
    return 'refresh_token';
  }

  protected getRequiredRequestParameters (): string[] {
    return [
      'refresh_token',
    ];
  }
}
