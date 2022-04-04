import { ProviderInterface } from '../contracts/provider';
import JwtProvider, { JwtProviderOptions } from './JwtProvider';
import OAuth2Provider, { OAuth2ProviderOptions } from './OAuth2Provider';

export const availableProviders = [
  OAuth2Provider,
  JwtProvider,
] as const;
export type ProviderOptions =
  OAuth2ProviderOptions
  | JwtProviderOptions
  | Record<string, never>
  ;
export type ProviderTypes = typeof availableProviders[number] | (new (...args: any[]) => ProviderInterface);

export { OAuth2Provider, JwtProvider };
