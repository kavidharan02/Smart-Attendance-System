import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
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
    // Simulate auth check
    const checkAuth = () => {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, this would call your backend
    if (email === 'admin@example.com' && password === 'demo123') {
      const mockUser: User = {
        id: '1',
        email,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const signup = async (email: string, password: string) => {
    // Mock signup
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      role: 'admin',
      created_at: new Date().toISOString(),
    };
    
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

