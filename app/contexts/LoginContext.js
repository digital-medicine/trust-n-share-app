import React from 'react';


const LoginContext = React.createContext();
function useIsLoggedIn() {
  const isLoggedIn = React.useContext(LoginContext);
  return isLoggedIn;
}
function useIsLoggedOut() {
  const isLoggedIn = React.useContext(LoginContext);
  return !isLoggedIn;
}

export { LoginContext, useIsLoggedIn, useIsLoggedOut };
