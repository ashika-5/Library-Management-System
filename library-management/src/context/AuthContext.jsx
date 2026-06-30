import { createContext, useContext, useState, useEffect } from "react";
import { readToken } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lbm_token");
    if (token) {
      const decoded = readToken(token);
      if (decoded) setUser(decoded);
    }
    setLoading(false);
  }, []);

  function login({ token }) {
    localStorage.setItem("lbm_token", token);
    const decoded = readToken(token);
    setUser(decoded);
  }

  function logout() {
    localStorage.removeItem("lbm_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
