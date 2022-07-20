import { RefreshTokenFailedException } from '../exception';
import { LoginOptions } from '../types';
import { useAuth } from './index';

const useRefresh = (): (url: string, autoLogin?: boolean, options?: RequestInit) => Promise<boolean | LoginOptions> => {
  const { getRefreshToken, supportsRefresh, login } = useAuth();

  return (url: string, autoLogin = true, options = {}) => {
    if (!supportsRefresh()) {
      return Promise.resolve(false);
    }

    const refreshToken = getRefreshToken();

    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      ...options,
    }).then(async (response) => {
      if (!response.ok) {
        throw new RefreshTokenFailedException(response.statusText);
      }

      return response.json().then((body) => {
        if (autoLogin) {
          return login({
            accessToken: body.token,
            refreshToken: body.refresh_token,
          }).then(() => ({
            accessToken: body.token,
            refreshToken: body.refresh_token,
          }));
        } else {
          return {
            accessToken: body.token,
            refreshToken: body.refresh_token,
          };
        }
      });
    });
  };
};

export default useRefresh;
