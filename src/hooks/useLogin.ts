import { LoginFailedException } from '../exception';
import { useAuth } from './index';

const useLogin = (): (url: string, payload: Record<string, unknown>, options: RequestInit) => Promise<void> => {
  const { login } = useAuth();

  return (url, payload, options = {}) => {
    return fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(payload),
      ...options,
    }).then(async (response) => {
      if (!response.ok) {
        throw new LoginFailedException(response.statusText);
      }

      return response.json().then((res) => {
        return login({
          accessToken: res.token,
          refreshToken: res.refresh_token,
        });
      });
    });
  };
};

export default useLogin;
