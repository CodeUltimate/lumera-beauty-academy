const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  role: 'STUDENT' | 'EDUCATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DEACTIVATED';
  emailVerified: boolean;
  timezone: string | null;
  specialty: string | null;
  website: string | null;
  instagram: string | null;
  educatorVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  specialty?: string;
  website?: string;
  instagram?: string;
  timezone?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  classReminders: boolean;
  studentEnrollments: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  validationErrors?: Record<string, string>;
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUri: string;
  manualEntryKey: string;
  issuer: string;
  accountName: string;
}

export interface TwoFactorStatus {
  enabled: boolean;
}

export interface TwoFactorVerifyRequest {
  secret: string;
  code: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class SettingsApi {
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

  // Profile
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/v1/user/settings/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return this.request<UserProfile>('/v1/user/settings/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return this.request<NotificationPreferences>('/v1/user/settings/notifications');
  }

  async updateNotificationPreferences(data: NotificationPreferences): Promise<NotificationPreferences> {
    return this.request<NotificationPreferences>('/v1/user/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Account
  async resendVerificationEmail(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/v1/user/settings/resend-verification', {
      method: 'POST',
    });
  }

  async deactivateAccount(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/v1/user/settings/account', {
      method: 'DELETE',
    });
  }

  // Two-Factor Authentication
  async getTwoFactorSetup(): Promise<TwoFactorSetup> {
    return this.request<TwoFactorSetup>('/v1/user/2fa/setup');
  }

  async getTwoFactorStatus(): Promise<TwoFactorStatus> {
    return this.request<TwoFactorStatus>('/v1/user/2fa/status');
  }

  async verifyAndEnableTwoFactor(data: TwoFactorVerifyRequest): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/v1/user/2fa/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async disableTwoFactor(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/v1/user/2fa', {
      method: 'DELETE',
    });
  }

  // Password
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/v1/user/settings/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const settingsApi = new SettingsApi();
