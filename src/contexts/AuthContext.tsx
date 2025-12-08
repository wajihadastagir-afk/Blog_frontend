import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'admin' | 'user';
  bio?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user data
      axios.get(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
