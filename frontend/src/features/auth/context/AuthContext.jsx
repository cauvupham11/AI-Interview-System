import { useCallback, useMemo, useState } from "react";
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../services/auth.service";
import {
  clearAuthSession,
  getStoredAccount,
  getStoredAccessToken,
  getStoredRefreshToken,
  storeAuthSession,
} from "../services/auth.storage";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(() => getStoredAccount());
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(getStoredAccessToken() && getStoredRefreshToken()),
  );

  const setSession = useCallback((session) => {
    storeAuthSession(session);
    setAccount(session.account);
    setIsAuthenticated(true);
  }, []);

  const login = useCallback(
    async (payload) => {
      const session = await loginRequest(payload);
      setSession(session);
      return session;
    },
    [setSession],
  );

  const register = useCallback(
    async (payload) => {
      const session = await registerRequest(payload);
      setSession(session);
      return session;
    },
    [setSession],
  );

  const logout = useCallback(async () => {
    try {
      if (getStoredAccessToken()) {
        await logoutRequest();
      }
    } finally {
      clearAuthSession();
      setAccount(null);
      setIsAuthenticated(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      account,
      isAuthenticated,
      login,
      logout,
      register,
      setSession,
    }),
    [account, isAuthenticated, login, logout, register, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
