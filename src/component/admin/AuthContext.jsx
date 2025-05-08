import React, { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
const AuthContext = createContext();

// Provide AuthContext to children
export const AuthProvider = ({ children }) => {
  // Initialize auth state with localStorage values
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("authToken");
    const username = localStorage.getItem("authUsername");
    return { token: token || null, username: username || null };
  });

  // Login function
  const login = (token, username) => {
    setAuth({ token, username });
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUsername", username);
  };

  // Logout function
  const logout = () => {
    setAuth({ token: null, username: null });
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUsername");
  };

  // Check if user is authenticated
  const isAuthenticated = !!auth.token;

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
