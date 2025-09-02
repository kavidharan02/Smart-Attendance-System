import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
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

  return {
    user,
    loading,
    login,
    logout,
    signup,
  };
};