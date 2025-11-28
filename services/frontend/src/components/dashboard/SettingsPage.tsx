'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, User, Lock, Bell, CreditCard, Globe, FileText,
  Loader2, Check, AlertCircle, ExternalLink, Shield, Key,
  Mail, Clock, Languages, X, Copy
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { settingsApi, UpdateProfileRequest, NotificationPreferences, TwoFactorSetup, ChangePasswordRequest } from '@/lib/api/settings';
import { QRCodeSVG } from 'qrcode.react';

const TIMEZONES = [
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

interface SettingsPageProps {
  role: 'student' | 'educator' | 'admin';
  backUrl: string;
}

export default function SettingsPage({ role, backUrl }: SettingsPageProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile form data
  const [profileData, setProfileData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    specialty: '',
    website: '',
    instagram: '',
    timezone: 'Europe/London',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailNotifications: true,
    classReminders: true,
    studentEnrollments: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Load profile data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profile, notifPrefs, twoFactorStatus] = await Promise.all([
          settingsApi.getProfile(),
          settingsApi.getNotificationPreferences(),
          settingsApi.getTwoFactorStatus(),
        ]);

        setProfileData({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone || '',
          bio: profile.bio || '',
          specialty: profile.specialty || '',
          website: profile.website || '',
          instagram: profile.instagram || '',
          timezone: profile.timezone || 'Europe/London',
        });

        setNotifications(notifPrefs);
        setTwoFactorEnabled(twoFactorStatus.enabled);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await settingsApi.updateProfile(profileData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      await settingsApi.updateNotificationPreferences(notifications);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
    setPasswordError(null);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSubmitPasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await settingsApi.changePassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordError(null);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handle2FASetup = async () => {
    setTwoFactorLoading(true);
    setTwoFactorError(null);
    try {
      const setup = await settingsApi.getTwoFactorSetup();
      setTwoFactorSetup(setup);
      setShow2FAModal(true);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to initialize 2FA setup');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorSetup || verificationCode.length !== 6) return;

    setTwoFactorLoading(true);
    setTwoFactorError(null);
    try {
      await settingsApi.verifyAndEnableTwoFactor({
        secret: twoFactorSetup.secret,
        code: verificationCode,
      });
      setTwoFactorEnabled(true);
      setShow2FAModal(false);
      setTwoFactorSetup(null);
      setVerificationCode('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setTwoFactorError(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    setTwoFactorLoading(true);
    try {
      await settingsApi.disableTwoFactor();
      setTwoFactorEnabled(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to disable 2FA');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const copySecretToClipboard = () => {
    if (twoFactorSetup?.manualEntryKey) {
      navigator.clipboard.writeText(twoFactorSetup.manualEntryKey.replace(/\s/g, ''));
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const close2FAModal = () => {
    setShow2FAModal(false);
    setTwoFactorSetup(null);
    setVerificationCode('');
    setTwoFactorError(null);
  };

  // Define sections based on role
  const baseSections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const educatorSections = [
    ...baseSections,
    { id: 'payout', label: 'Payout Settings', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'legal', label: 'Legal & Tax', icon: FileText },
  ];

  const studentSections = [
    ...baseSections,
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const adminSections = [
    ...baseSections,
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  const sections = role === 'educator'
    ? educatorSections
    : role === 'admin'
      ? adminSections
      : studentSections;

  const Toggle = ({
    checked,
    onChange
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-[var(--champagne)]' : 'bg-[var(--border)]'
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={backUrl}
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Settings</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-light text-green-700">Settings saved successfully!</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-light text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-[var(--champagne)]/10 text-[var(--champagne)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--cream)]'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="text-sm font-light">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="card-premium p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[var(--champagne)] animate-spin" />
              </div>
            ) : (
              <>
                {/* Profile Section */}
                {activeSection === 'profile' && (
                  <div className="card-premium p-6">
                    <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">
                      {role === 'educator' ? 'Educator Profile' : role === 'admin' ? 'Admin Profile' : 'Profile Information'}
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
                          <span className="text-3xl font-light text-[var(--charcoal)]">
                            {profileData.firstName && profileData.lastName
                              ? `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
                              : user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : ''}
                          </span>
                        </div>
                        <div>
                          <button className="btn-secondary text-sm mb-2">Change Photo</button>
                          <p className="text-xs font-light text-[var(--text-muted)]">
                            Recommended: 400x400px, max 2MB
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="input-premium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="input-premium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input-premium bg-[var(--cream)] cursor-not-allowed"
                          />
                          <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                            Email cannot be changed
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="input-premium"
                            placeholder="+44 20 1234 5678"
                          />
                        </div>
                        {role === 'educator' && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                              Primary Specialty
                            </label>
                            <input
                              type="text"
                              value={profileData.specialty}
                              onChange={(e) => setProfileData({ ...profileData, specialty: e.target.value })}
                              className="input-premium"
                              placeholder="e.g., Aesthetics, Hair Styling, Makeup Artistry"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="input-premium min-h-[120px] resize-none"
                          placeholder={role === 'educator'
                            ? "Tell students about your background, expertise, and teaching style..."
                            : "Tell us a bit about yourself..."
                          }
                        />
                        <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                          {(profileData.bio?.length || 0)}/2000 characters
                        </p>
                      </div>

                      {role === 'educator' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                              Website
                            </label>
                            <input
                              type="url"
                              value={profileData.website}
                              onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                              className="input-premium"
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                              Instagram
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">@</span>
                              <input
                                type="text"
                                value={profileData.instagram}
                                onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })}
                                className="input-premium pl-8"
                                placeholder="yourusername"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <div className="card-premium p-6">
                      <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Security Settings</h2>

                      {/* Password */}
                      <div className="border-b border-[var(--border-light)] pb-6 mb-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--beige)] flex items-center justify-center">
                              <Key className="w-5 h-5 text-[var(--champagne)]" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-[var(--charcoal)]">Password</h3>
                              <p className="text-sm font-light text-[var(--text-muted)] mt-1">
                                Change your password to keep your account secure
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handlePasswordChange}
                            className="btn-secondary text-sm"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="border-b border-[var(--border-light)] pb-6 mb-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              twoFactorEnabled ? 'bg-green-100' : 'bg-[var(--beige)]'
                            }`}>
                              <Shield className={`w-5 h-5 ${twoFactorEnabled ? 'text-green-600' : 'text-[var(--champagne)]'}`} />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-medium text-[var(--charcoal)]">Two-Factor Authentication</h3>
                                {twoFactorEnabled && (
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center space-x-1">
                                    <Check className="w-3 h-3" />
                                    <span>Enabled</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-light text-[var(--text-muted)] mt-1">
                                {twoFactorEnabled
                                  ? 'Your account is protected with two-factor authentication.'
                                  : 'Add an extra layer of security using an authenticator app'
                                }
                              </p>
                            </div>
                          </div>
                          {twoFactorEnabled ? (
                            <button
                              onClick={handleDisable2FA}
                              disabled={twoFactorLoading}
                              className="px-4 py-2 text-sm font-light text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors flex items-center space-x-2"
                            >
                              {twoFactorLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <span>Disable 2FA</span>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={handle2FASetup}
                              disabled={twoFactorLoading}
                              className="btn-secondary text-sm flex items-center space-x-2"
                            >
                              {twoFactorLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <span>Set Up 2FA</span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Email Verification Status */}
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--beige)] flex items-center justify-center">
                              <Mail className="w-5 h-5 text-[var(--champagne)]" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-[var(--charcoal)]">Email Verification</h3>
                              <p className="text-sm font-light text-[var(--text-muted)] mt-1">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                          {user?.emailVerified ? (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded flex items-center space-x-1">
                              <Check className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          ) : (
                            <button className="btn-secondary text-sm">Resend Verification</button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="card-premium p-6 border-red-200">
                      <h3 className="text-lg font-light text-red-600 mb-4">Danger Zone</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--charcoal)]">Deactivate Account</p>
                          <p className="text-sm font-light text-[var(--text-muted)]">
                            Permanently deactivate your account and remove all data
                          </p>
                        </div>
                        <button className="px-4 py-2 text-sm font-light text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors">
                          Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                  <div className="card-premium p-6">
                    <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      {/* Common: Email Notifications */}
                      <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                        <div>
                          <p className="text-sm font-medium text-[var(--charcoal)]">Email Notifications</p>
                          <p className="text-sm font-light text-[var(--text-muted)]">Receive important platform updates via email</p>
                        </div>
                        <Toggle
                          checked={notifications.emailNotifications}
                          onChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                        />
                      </div>

                      {/* Student/Educator: Class Reminders */}
                      {(role === 'student' || role === 'educator') && (
                        <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                          <div>
                            <p className="text-sm font-medium text-[var(--charcoal)]">Class Reminders</p>
                            <p className="text-sm font-light text-[var(--text-muted)]">Get notified before your classes start</p>
                          </div>
                          <Toggle
                            checked={notifications.classReminders}
                            onChange={(checked) => setNotifications({ ...notifications, classReminders: checked })}
                          />
                        </div>
                      )}

                      {/* Educator-specific */}
                      {role === 'educator' && (
                        <>
                          <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">Student Enrollments</p>
                              <p className="text-sm font-light text-[var(--text-muted)]">Notifications when students enroll in your classes</p>
                            </div>
                            <Toggle
                              checked={notifications.studentEnrollments}
                              onChange={(checked) => setNotifications({ ...notifications, studentEnrollments: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">Weekly Digest</p>
                              <p className="text-sm font-light text-[var(--text-muted)]">Receive a weekly summary of your class performance</p>
                            </div>
                            <Toggle
                              checked={notifications.weeklyDigest}
                              onChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                            />
                          </div>
                        </>
                      )}

                      {/* Admin-specific */}
                      {role === 'admin' && (
                        <>
                          <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">New Educator Applications</p>
                              <p className="text-sm font-light text-[var(--text-muted)]">Get notified when educators apply for verification</p>
                            </div>
                            <Toggle
                              checked={notifications.studentEnrollments}
                              onChange={(checked) => setNotifications({ ...notifications, studentEnrollments: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">User Reports</p>
                              <p className="text-sm font-light text-[var(--text-muted)]">Notifications for reported content or users</p>
                            </div>
                            <Toggle
                              checked={notifications.weeklyDigest}
                              onChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">System Alerts</p>
                              <p className="text-sm font-light text-[var(--text-muted)]">Critical platform issues and maintenance updates</p>
                            </div>
                            <Toggle
                              checked={notifications.classReminders}
                              onChange={(checked) => setNotifications({ ...notifications, classReminders: checked })}
                            />
                          </div>

                          <div className="flex items-center justify-between py-3 border-b border-[var(--border-light)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">Weekly Platform Summary</p>
                              <p className="text-sm font-light text-[var(--text-muted)]">Weekly overview of platform activity and metrics</p>
                            </div>
                            <Toggle
                              checked={notifications.marketingEmails}
                              onChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                            />
                          </div>
                        </>
                      )}

                      {/* Student/Educator: Marketing Emails */}
                      {(role === 'student' || role === 'educator') && (
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm font-medium text-[var(--charcoal)]">Marketing Emails</p>
                            <p className="text-sm font-light text-[var(--text-muted)]">Tips, product updates, and promotional content</p>
                          </div>
                          <Toggle
                            checked={notifications.marketingEmails}
                            onChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                          />
                        </div>
                      )}

                      <button
                        onClick={handleSaveNotifications}
                        disabled={isSaving}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Preferences</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Billing Section (Students only) */}
                {activeSection === 'billing' && role === 'student' && (
                  <div className="card-premium p-6">
                    <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Billing Information</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-[var(--charcoal)] mb-4">Payment Method</h3>
                        <div className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 bg-[var(--cream)] rounded flex items-center justify-center text-xs font-medium">
                              VISA
                            </div>
                            <div>
                              <p className="text-sm font-light text-[var(--charcoal)]">•••• •••• •••• 4242</p>
                              <p className="text-xs font-light text-[var(--text-muted)]">Expires 12/25</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Default
                          </span>
                        </div>
                        <button className="btn-secondary">Add Payment Method</button>
                      </div>

                      <div className="pt-6 border-t border-[var(--border-light)]">
                        <h3 className="text-sm font-medium text-[var(--charcoal)] mb-4">Billing History</h3>
                        <p className="text-sm font-light text-[var(--text-muted)]">
                          No billing history available
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payout Settings (Educators only) */}
                {activeSection === 'payout' && role === 'educator' && (
                  <div className="card-premium p-6">
                    <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Payout Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-[var(--charcoal)] mb-4">Payout Method</h3>
                        <div className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 bg-[var(--cream)] rounded flex items-center justify-center text-xs font-medium">
                              BANK
                            </div>
                            <div>
                              <p className="text-sm font-light text-[var(--charcoal)]">Bank Account •••• 4567</p>
                              <p className="text-xs font-light text-[var(--text-muted)]">Barclays UK</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Default
                          </span>
                        </div>
                        <button className="btn-secondary">Add Payout Method</button>
                      </div>

                      <div className="pt-6 border-t border-[var(--border-light)]">
                        <h3 className="text-sm font-medium text-[var(--charcoal)] mb-4">Payout Schedule</h3>
                        <p className="text-sm font-light text-[var(--text-secondary)] mb-4">
                          Payouts are processed every 2 weeks. Minimum payout amount is $50.
                        </p>
                        <select className="input-premium max-w-xs">
                          <option>Every 2 weeks (default)</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Section */}
                {activeSection === 'preferences' && (
                  <div className="card-premium p-6">
                    <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Preferences</h2>
                    <div className="space-y-6">
                      {/* Timezone */}
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <Clock className="w-5 h-5 text-[var(--champagne)]" />
                          <label className="text-sm font-medium text-[var(--charcoal)]">Timezone</label>
                        </div>
                        <p className="text-sm font-light text-[var(--text-muted)] mb-3">
                          All class schedules will be displayed in your selected timezone
                        </p>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                          className="input-premium max-w-md"
                        >
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Language */}
                      <div className="pt-6 border-t border-[var(--border-light)]">
                        <div className="flex items-center space-x-3 mb-3">
                          <Languages className="w-5 h-5 text-[var(--champagne)]" />
                          <label className="text-sm font-medium text-[var(--charcoal)]">Language</label>
                        </div>
                        <p className="text-sm font-light text-[var(--text-muted)] mb-3">
                          Choose your preferred language for the platform
                        </p>
                        <select className="input-premium max-w-md">
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="btn-primary flex items-center space-x-2 mt-6"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Preferences</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Legal & Tax Section (Educators only) */}
                {activeSection === 'legal' && role === 'educator' && (
                  <div className="space-y-6">
                    <div className="card-premium p-6">
                      <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Legal Documents</h2>
                      <div className="space-y-4">
                        <a
                          href="/terms"
                          target="_blank"
                          className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded hover:bg-[var(--cream)] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[var(--champagne)]" />
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">Terms of Service</p>
                              <p className="text-xs font-light text-[var(--text-muted)]">Last updated: January 2025</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                        </a>

                        <a
                          href="/privacy"
                          target="_blank"
                          className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded hover:bg-[var(--cream)] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[var(--champagne)]" />
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">Privacy Policy</p>
                              <p className="text-xs font-light text-[var(--text-muted)]">Last updated: January 2025</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                        </a>

                        <a
                          href="/educator-agreement"
                          target="_blank"
                          className="flex items-center justify-between p-4 border border-[var(--border-light)] rounded hover:bg-[var(--cream)] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[var(--champagne)]" />
                            <div>
                              <p className="text-sm font-medium text-[var(--charcoal)]">Educator Agreement</p>
                              <p className="text-xs font-light text-[var(--text-muted)]">Your agreement with Luméra</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-[var(--text-muted)]" />
                        </a>
                      </div>
                    </div>

                    <div className="card-premium p-6">
                      <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Tax Information</h2>
                      <p className="text-sm font-light text-[var(--text-secondary)] mb-4">
                        As an educator, you may need to provide tax information depending on your country of residence.
                      </p>

                      <div className="bg-[var(--cream)] rounded p-4 mb-6">
                        <h3 className="text-sm font-medium text-[var(--charcoal)] mb-2">Tax Documents</h3>
                        <p className="text-sm font-light text-[var(--text-muted)]">
                          Your annual earnings statements will be available here at the end of each tax year.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-[var(--border-light)] rounded">
                          <div>
                            <p className="text-sm font-light text-[var(--charcoal)]">2024 Earnings Statement</p>
                            <p className="text-xs font-light text-[var(--text-muted)]">Available January 2025</p>
                          </div>
                          <button className="text-sm font-light text-[var(--text-muted)]" disabled>
                            Not available yet
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && twoFactorSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={close2FAModal} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[var(--beige)] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--champagne)]" />
                </div>
                <h2 className="text-lg font-light text-[var(--charcoal)]">Set Up Two-Factor Authentication</h2>
              </div>
              <button
                onClick={close2FAModal}
                className="text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--champagne)] text-white text-sm flex items-center justify-center">1</span>
                  <h3 className="text-sm font-medium text-[var(--charcoal)]">Install an Authenticator App</h3>
                </div>
                <p className="text-sm font-light text-[var(--text-muted)] ml-8">
                  Download Google Authenticator, Microsoft Authenticator, or any TOTP-compatible app.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--champagne)] text-white text-sm flex items-center justify-center">2</span>
                  <h3 className="text-sm font-medium text-[var(--charcoal)]">Scan the QR Code</h3>
                </div>
                <div className="ml-8">
                  <div className="flex justify-center p-4 bg-white rounded border border-[var(--border-light)]">
                    <QRCodeSVG
                      value={twoFactorSetup.qrCodeUri}
                      size={180}
                      level="M"
                      includeMargin
                    />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-light text-[var(--text-muted)] mb-2">
                      Or enter this code manually:
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-sm font-mono bg-[var(--cream)] px-3 py-2 rounded tracking-wider">
                        {twoFactorSetup.manualEntryKey}
                      </code>
                      <button
                        onClick={copySecretToClipboard}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--charcoal)] hover:bg-[var(--cream)] rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedSecret ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--champagne)] text-white text-sm flex items-center justify-center">3</span>
                  <h3 className="text-sm font-medium text-[var(--charcoal)]">Enter Verification Code</h3>
                </div>
                <div className="ml-8">
                  <p className="text-sm font-light text-[var(--text-muted)] mb-3">
                    Enter the 6-digit code from your authenticator app.
                  </p>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                      setTwoFactorError(null);
                    }}
                    placeholder="000000"
                    className="input-premium text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />

                  {twoFactorError && (
                    <div className="mt-3 flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-light">{twoFactorError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-[var(--border-light)]">
              <button onClick={close2FAModal} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleVerify2FA}
                disabled={verificationCode.length !== 6 || twoFactorLoading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {twoFactorLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Enable 2FA</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closePasswordModal} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[var(--beige)] flex items-center justify-center">
                  <Key className="w-5 h-5 text-[var(--champagne)]" />
                </div>
                <h2 className="text-lg font-light text-[var(--charcoal)]">Change Password</h2>
              </div>
              <button
                onClick={closePasswordModal}
                className="text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                    setPasswordError(null);
                  }}
                  className="input-premium"
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                    setPasswordError(null);
                  }}
                  className="input-premium"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                    setPasswordError(null);
                  }}
                  className="input-premium"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
              </div>

              {passwordError && (
                <div className="flex items-center space-x-2 text-red-600 p-3 bg-red-50 rounded">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-light">{passwordError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-[var(--border-light)]">
              <button onClick={closePasswordModal} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmitPasswordChange}
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword || passwordLoading}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Changing...</span>
                  </>
                ) : (
                  <span>Change Password</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
