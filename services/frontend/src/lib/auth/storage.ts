import { AuthResponse } from './api';

const ACCESS_TOKEN_KEY = 'lumera_access_token';
const REFRESH_TOKEN_KEY = 'lumera_refresh_token';
const USER_KEY = 'lumera_user';
const TOKEN_EXPIRY_KEY = 'lumera_token_expiry';

export interface StoredUser {
  id: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'EDUCATOR' | 'ADMIN';
  avatarUrl: string | null;
}

class AuthStorage {
  private isClient = typeof window !== 'undefined';

  saveAuth(response: AuthResponse): void {
    if (!this.isClient) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));

    // Calculate expiry time
    const expiryTime = Date.now() + response.expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  getAccessToken(): string | null {
    if (!this.isClient) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isClient) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): StoredUser | null {
    if (!this.isClient) return null;
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  getTokenExpiry(): number | null {
    if (!this.isClient) return null;
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    // Consider token expired 1 minute before actual expiry
    return Date.now() > expiry - 60000;
  }

  clearAuth(): void {
    if (!this.isClient) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired();
  }
}

export const authStorage = new AuthStorage();
