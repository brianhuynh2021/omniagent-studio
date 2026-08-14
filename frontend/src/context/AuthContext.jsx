import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl as getApiUrl } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('omniagent_auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySavedToken = async () => {
      const savedToken = localStorage.getItem('omniagent_auth_token');
      if (savedToken) {
        try {
          const res = await fetch(getApiUrl('/api/v1/auth/me'), {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setToken(savedToken);
          } else {
            // Token expired or invalid
            localStorage.removeItem('omniagent_auth_token');
            localStorage.removeItem('omniagent_auth_user');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error("Auth token verification error:", err);
        }
      }
      setIsLoading(false);
    };

    verifySavedToken();
  }, []);

  const login = async (username, password) => {
    const res = await fetch(getApiUrl('/api/v1/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to authenticate');
    }

    localStorage.setItem('omniagent_auth_token', data.access_token);
    localStorage.setItem('omniagent_auth_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (username, email, password, role = 'user') => {
    const res = await fetch(getApiUrl('/api/v1/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to register account');
    }

    localStorage.setItem('omniagent_auth_token', data.access_token);
    localStorage.setItem('omniagent_auth_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('omniagent_auth_token');
    localStorage.removeItem('omniagent_auth_user');
    setToken(null);
    setUser(null);
  };

  const authFetch = (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      authFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
