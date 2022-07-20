import { RefreshTokenFailedException } from '../exception';
import { useAuth } from './index';

const useRefresh = (): (url: string, options: RequestInit) => Promise<boolean> => {
  const { getRefreshToken, supportsRefresh } = useAuth();

  return (url: string, options = {}) => {
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

      return true;
    });
  };
};

export default useRefresh;
