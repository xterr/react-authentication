import React, { FunctionComponent, useCallback, useEffect, useMemo, useReducer } from 'react';
import AuthContext from './AuthContext';
import { CacheOptions, CacheTypes, InMemoryCache } from './cache';
import { AuthContextInterface } from './contracts';
import { MissingTokenException, RedirectException } from './exception';
import { CacheFactory, ProviderFactory } from './factory';
import { ProviderOptions, ProviderTypes } from './provider';
import { AuthState, LoginOptions } from './types';

export type AuthProviderProps = {
  provider: { type: ProviderTypes, options?: ProviderOptions },
  cache?: { type: CacheTypes, options?: CacheOptions },
};

type Action =
  { type: 'LOGOUT' | 'LOGIN_STARTED' }
  | { type: 'INITIALIZED', isAuthenticated: boolean }
  | { type: 'ERROR', error: Error }
  | { type: 'REDIRECT', error: RedirectException };

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  isRedirecting: false,
};

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;
const ERROR_RE = /[?&]error=[^&]+/;

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  (CODE_RE.test(searchParams) || ERROR_RE.test(searchParams)) &&
  STATE_RE.test(searchParams);

const normalizeErrorFn = (fallbackMessage: string) => (
  error: Error | { error: string, error_description?: string } | ProgressEvent,
): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error(fallbackMessage);
};

export const loginError = normalizeErrorFn('Login failed');
export const logoutError = normalizeErrorFn('Logout failed');
export const tokenError = normalizeErrorFn('Get access token failed');

const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'LOGIN_STARTED':
      return {
        ...state,
        isLoading: true,
        isRedirecting: false,
      };
    case 'INITIALIZED':
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        isLoading: false,
        isRedirecting: false,
        error: undefined,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isRedirecting: false,
      };
    case 'REDIRECT':
      return {
        ...state,
        isAuthenticated: false,
        isRedirecting: true,
        error: action.error,
      };
    case 'ERROR':
      return {
        ...state,
        isLoading: false,
        isRedirecting: false,
        error: action.error,
      };
  }
};

const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children, cache, provider }) => {
  const [ state, dispatch ] = useReducer(authReducer, initialAuthState);

  const oCache = useMemo(() => {
    return typeof cache !== 'undefined'
      ? new CacheFactory().create(cache.type, cache.options)
      : new CacheFactory().create(InMemoryCache);
  }, [ cache ]);

  const oProvider = useMemo(() => {
    return new ProviderFactory().create(provider.type, provider.options, oCache);
  }, [ provider ]);

  useEffect(() => {
    (async (): Promise<void> => {
      dispatch({ type: 'LOGIN_STARTED' });

      try {
        await oProvider.initialize();
        dispatch({ type: 'INITIALIZED', isAuthenticated: oProvider.isAuthenticated() });
      } catch (error: any) {
        if (error instanceof MissingTokenException) {
          dispatch({ type: 'INITIALIZED', isAuthenticated: false });
        } else if (error instanceof RedirectException) {
          dispatch({ type: 'REDIRECT', error: error });
        } else {
          dispatch({ type: 'ERROR', error: loginError(error) });
        }
      }
    })();
  }, [ oProvider ]);

  const login = useCallback(async (options: LoginOptions) => {
    dispatch({ type: 'LOGIN_STARTED' });

    try {
      await oProvider.login(options);
      dispatch({ type: 'INITIALIZED', isAuthenticated: oProvider.isAuthenticated() });
    } catch (error: any) {
      if (error instanceof RedirectException) {
        dispatch({ type: 'REDIRECT', error: error });
      } else {
        dispatch({ type: 'ERROR', error: loginError(error) });
      }
    }
  }, [ oProvider ]);

  const logout = useCallback(async () => {
    try {
      await oProvider.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      dispatch({ type: 'ERROR', error: logoutError(error) });
    }
  }, [ oProvider ]);

  const contextValue: AuthContextInterface = useMemo(() => ({
    authState: state,
    login,
    logout,
  }), [
    state,
    login,
    logout,
  ]);

  return (
    <AuthContext.Provider value={ contextValue }>
      { children }
    </AuthContext.Provider>
  );
};

export default AuthProvider;
