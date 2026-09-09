/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  clearToken,
  getCurrentUser,
  getToken,
  login as loginRequest,
  register as registerRequest,
  setToken,
} from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    const restoreSession = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        setUser(await getCurrentUser());
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleUnauthorized = () => {
      setUser(null);
      setLoading(false);
    };

    restoreSession();
    window.addEventListener("technova:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("technova:unauthorized", handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    const result = await loginRequest(credentials);
    setToken(result.access_token);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const register = async (details) => registerRequest(details);

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
