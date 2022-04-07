import { GrantInterface } from '../contracts/grant';
import { BadMethodCallException } from '../exception';

export default abstract class AbstractGrant implements GrantInterface {
  public prepareRequestParameters (options: Record<string, string> = {}): Record<string, string> {
    const defaults = {
      grant_type: this.getName(),
    };

    const required = this.getRequiredRequestParameters();
    const provided = { ...defaults, ...options };

    this.checkRequiredParameters(required, provided);

    return provided;
  }

  protected abstract getName (): string;

  protected abstract getRequiredRequestParameters (): string[];

  private checkRequiredParameters (names: string[], options: Record<string, string>) {
    const providedOptionNames = Object.keys(options);

    for (const name of names) {
      if (!providedOptionNames.includes(name)) {
        throw new BadMethodCallException(`Required parameter not passed: ${ name }`);
      }
    }
  }
}
