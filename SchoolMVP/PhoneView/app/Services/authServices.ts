// services/authService.ts
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  role: string;
  username: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  role?: string;
  token?: string;
}

export const authService = {
  // Get stored token
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('userToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Get user role
  getRole: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('userRole');
    } catch (error) {
      console.error('Error getting role:', error);
      return null;
    }
  },

  // Get username
  getUsername: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('username');
    } catch (error) {
      console.error('Error getting username:', error);
      return null;
    }
  },

  // Get decoded token info
  async getTokenInfo(): Promise<JWTPayload | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;
      
      const decoded: JWTPayload = jwtDecode<JWTPayload>(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is valid and not expired
  async isTokenValid(): Promise<boolean>{
    try {
      const token = await this.getToken();
      if (!token) return false;
      
      const decoded: JWTPayload = jwtDecode<JWTPayload>(token);
      
      if (decoded.exp) {
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  },

  // Logout - clear all stored data
  async logout(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userRole');
      await SecureStore.deleteItemAsync('username');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  },

  // Login function
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch('http://192.168.1.3:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const token: string = await response.text();
        const decoded: JWTPayload = jwtDecode<JWTPayload>(token);
        
        // Check if token is expired
        if (decoded.exp) {
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            return { success: false, error: 'Token expiré' };
          }
        }
        
        // Store token and user info
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userRole', decoded.role);
        await SecureStore.setItemAsync('username', decoded.username || credentials.username);
        
        return { 
          success: true, 
          role: decoded.role,
          token: token
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.message || 'Échec de la connexion' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erreur réseau' };
    }
  },

  // Make authenticated API requests
  async makeAuthenticatedRequest(
    url: string, 
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const isValid = await this.isTokenValid();
    if (!isValid) {
      throw new Error('Token expired');
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  }
};