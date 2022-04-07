# React Authentication

Universal Authentication with support for simple JWT and OAuth 2.0 authentication

## Installation

```bash
npm install --save @xterr/react-authentication
```

or:

```bash
yarn add @xterr/react-authentication
```

## Getting Started

Configure the library wrapping your application in `AuthProvider`:

```jsx
import React from 'react';
import { AuthProvider } from '@xterr/react-authentication';
import App from './App';

const App = () => (
  <AuthProvider>
    <App/>
  </AuthProvider>
)
```

## Protect a route

Example of a component that can protect other components and redirect the user to a login page if the user is not
authenticated:

```jsx
import React from 'react';
import { useAuth } from '@xterr/react-authentication';
import { Navigate } from 'react-router';

const ProtectedRoute = ({redirectTo, children}) => {
  const {authState: {isAuthenticated}} = useAuth();
  return (isAuthenticated ? React.Children.only(children) : <Navigate to={redirectTo} replace/>);
};
```
