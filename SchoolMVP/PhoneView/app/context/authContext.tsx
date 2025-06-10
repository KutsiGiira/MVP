// context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, JWTPayload, AuthRequest, AuthResponse } from '../Services/authServices';

interface User {
  role: string;
  username: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: AuthRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const isValid = await authService.isTokenValid();
      if (isValid) {
        const role = await authService.getRole();
        const username = await authService.getUsername();
        const tokenInfo = await authService.getTokenInfo();
        
        if (role && username && tokenInfo) {
          setUser({
            role,
            username,
            ...tokenInfo
          });
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid user data');
        }
      } else {
        // Token is invalid or expired, clear it
        await authService.logout();
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.role) {
        const tokenInfo = await authService.getTokenInfo();
        
        if (tokenInfo) {
          setUser({
            role: result.role,
            username: credentials.username,
            ...tokenInfo
          });
          setIsAuthenticated(true);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};