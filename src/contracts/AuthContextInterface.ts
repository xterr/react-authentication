import { AuthState, LoginOptions } from '../types';
import { ProviderInterface } from './provider';

export default interface AuthContextInterface {
  authState: AuthState;
  provider?: ProviderInterface;

  logout (): Promise<void>;

  login (options: LoginOptions): Promise<void>;
}
