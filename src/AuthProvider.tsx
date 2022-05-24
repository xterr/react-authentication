import React, { FunctionComponent, useCallback, useEffect, useMemo, useReducer } from 'react';
import AuthContext from './AuthContext';
import { InMemoryCache } from './cache';
import { AuthContextInterface } from './contracts';
import { ProviderInterface } from './contracts/provider';
import { MissingTokenException, RedirectException } from './exception';
import { JwtProvider } from './provider';
import { AuthState, LoginOptions } from './types';

export type AuthProviderProps = {
  provider?: ProviderInterface,
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

const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children, provider }) => {
  const [ state, dispatch ] = useReducer(authReducer, initialAuthState);

  const oProvider = useMemo(() => {
    return typeof provider !== 'undefined'
      ? provider
      : new JwtProvider({ cache: new InMemoryCache() });
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
      await oProvider.login(options as never);
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

  const getAccessToken = () => oProvider.getAccessToken();

  const getRefreshToken = () => oProvider.getRefreshToken();

  const supportsRefresh = () => oProvider.supportsRefresh();

  const contextValue: AuthContextInterface = useMemo(() => ({
    authState: state,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    supportsRefresh,
  }), [
    state,
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    supportsRefresh,
  ]);

  return (
    <AuthContext.Provider value={ contextValue }>
      { children }
    </AuthContext.Provider>
  );
};

export default AuthProvider;
