import { createContext, useContext, useState, useEffect } from "react";
import { logoutUser } from "../services/authService";

const AuthContext = createContext(null);

function decodeJWT(token) {
  try {
    const payload = token.split(".")[1]; 
    return JSON.parse(atob(payload)); 
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("lbm_token");
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) setUser(decoded);
    }
    setLoading(false);
  }, []);

  function login({ token }) {
    localStorage.setItem("lbm_token", token);
    const decoded = decodeJWT(token);
    setUser(decoded);
  }

  async function logout() {
    await logoutUser(); // tells backend to invalidate token
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
