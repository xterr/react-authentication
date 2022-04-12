import { useContext, useEffect } from 'react';
import AuthContext from '../AuthContext';
import { AuthContextInterface } from '../contracts';

const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);

  useEffect(() => {
    (async (): Promise<void> => {
      if (context.provider?.supportsRefresh()) {
        return;
      }

      const isAuthenticated = context.provider?.isAuthenticated();

      if (context.authState.isAuthenticated !== isAuthenticated && isAuthenticated === false) {
        await context.logout();
      }
    })();
  });

  return context;
};

export default useAuth;
