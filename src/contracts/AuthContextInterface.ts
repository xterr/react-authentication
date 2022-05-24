import { AuthState } from '../types';
import { ProviderInterface } from './provider';

export default interface AuthContextInterface extends Pick<ProviderInterface, 'getAccessToken' | 'getRefreshToken' | 'supportsRefresh' | 'logout' | 'login'> {
  authState: AuthState;
}
