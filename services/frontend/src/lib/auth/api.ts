const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'EDUCATOR';
  phone?: string;
  specialty?: string;
  bio?: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: 'STUDENT' | 'EDUCATOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  timezone: string | null;
  specialty: string | null;
  website: string | null;
  instagram: string | null;
  educatorVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string | null;
    email: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'EDUCATOR' | 'ADMIN';
    avatarUrl: string | null;
  };
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  validationErrors?: Record<string, string>;
}

class AuthApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        status: response.status,
        error: 'Error',
        message: 'An unexpected error occurred',
      }));
      throw error;
    }

    return response.json();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken?: string): Promise<AuthResponse> {
    const options: RequestInit = { method: 'POST' };
    if (refreshToken) {
      options.body = JSON.stringify({ refreshToken });
    }
    return this.request<AuthResponse>('/v1/auth/refresh', options);
  }

  async logout(refreshToken?: string): Promise<void> {
    const options: RequestInit = { method: 'POST' };
    if (refreshToken) {
      options.body = JSON.stringify({ refreshToken });
    }
    await this.request<{ message: string }>('/v1/auth/logout', options);
  }

  async me(): Promise<AuthUser> {
    return this.request<AuthUser>('/v1/auth/me', {
      method: 'GET',
    });
  }
}

export const authApi = new AuthApi();
