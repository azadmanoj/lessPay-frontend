/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // Don't throw error, just return if no token
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const profile = await api.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear auth state on error
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set loading to false even if no token exists
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const login = async (token: string) => {
    try {
      localStorage.setItem("authToken", token); // Use consistent key
      await checkAuth();
    } catch (error) {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
    // Ensure we're fully logged out before redirecting
    window.location.href = "/";
  };

  // Provide loading state to children
  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { logout } = context;

  const logoutAndClearStorage = () => {
    localStorage.clear();

    logout();
  };

  return { ...context, logout: logoutAndClearStorage };
};
