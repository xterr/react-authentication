import React from 'react';

import { AuthContextInterface } from './contracts';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <AuthProvider>.');
};

const initialContext: AuthContextInterface = {
  authState: {
    isRedirecting: false,
    isAuthenticated: false,
    isLoading: false,
  },
  login: stub,
  logout: stub,
  getAccessToken: stub,
  getRefreshToken: stub,
  supportsRefresh: stub,
};

const AuthContext = React.createContext<AuthContextInterface>(initialContext);

export default AuthContext;
