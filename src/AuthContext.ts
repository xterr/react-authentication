import React from 'react';

import { AuthContextInterface } from './contracts';

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <Auth0Provider>.');
};

const initialContext: AuthContextInterface = {
  login: stub,
  logout: stub,
  authState: {
    isRedirecting: false,
    isAuthenticated: false,
    isLoading: false,
  },
};

const AuthContext = React.createContext<AuthContextInterface>(initialContext);

export default AuthContext;
