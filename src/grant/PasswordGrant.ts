import AbstractGrant from './AbstractGrant';

export default class PasswordGrant extends AbstractGrant {
  protected getName (): string {
    return 'password';
  }

  protected getRequiredRequestParameters (): string[] {
    return [
      'username',
      'password',
    ];
  }
}
