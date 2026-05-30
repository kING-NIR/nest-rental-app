import React, { createContext, useState, useContext, useEffect } from "react";
import { User, AuthContextType } from "../types";
import api from "../services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      api.setToken(storedToken);
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await api.verifyToken();
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (contact: string, password: string) => {
    try {
      setError(null);
      const response = await api.login(contact, password);
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  const signup = async (name: string, contact: string, password: string, role: "owner" | "tenant") => {
    try {
      setError(null);
      const response = await api.signup(name, contact, password, role);
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.clearToken();
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
