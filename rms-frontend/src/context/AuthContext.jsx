// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { validateToken } from "../api/auth";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    localStorage.removeItem("authUser");
  };

  const checkAuth = async () => {
    if (!user?.token) return;

    try {
      const response = await validateToken(user.token);
      // Backend returns { status: 'success' | 'error', ... }
      if (response?.status !== 'success') {
        // Token invalid, logout user
        logout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // Don't logout on timeout, just log the error
      // logout();
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored && !user) {
      setUser(JSON.parse(stored));
    }
    
    // Check auth on mount and every 5 minutes
    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
