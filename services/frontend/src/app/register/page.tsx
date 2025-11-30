'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';

type UserType = 'student' | 'educator';

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('register');
  const tHeader = useTranslations('header');
  const tCommon = useTranslations('common');
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
  });
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    clearError();
    const [firstNamePart, ...rest] = formData.name.trim().split(' ');
    const firstName = firstNamePart || 'User';
    const lastName = rest.join(' ') || 'Lumera';

    try {
      await registerUser(
        {
          firstName,
          lastName,
          email: formData.email,
          password: formData.password,
          role: userType === 'educator' ? 'EDUCATOR' : 'STUDENT',
          specialty: formData.specialty || undefined,
        },
        userType === 'educator' ? '/educator' : '/student'
      );
    } catch {
      // Error handled in context state
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--plum)] to-[var(--plum-light)] items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <h2 className="text-4xl font-extralight text-white mb-6">
            {t('startJourney')}
          </h2>
          <p className="text-lg font-light text-white/70 leading-relaxed">
            {t('journeyDesc')}
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3 text-white/80">
              <Check className="w-5 h-5 text-[var(--champagne)]" />
              <span className="font-light">{t('accessLive')}</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <Check className="w-5 h-5 text-[var(--champagne)]" />
              <span className="font-light">{t('verifiedCerts')}</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <Check className="w-5 h-5 text-[var(--champagne)]" />
              <span className="font-light">{t('globalAccess')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 safe-area-y">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="block mb-8 sm:mb-12">
            <h1 className="text-xl sm:text-2xl font-light tracking-tight text-[var(--charcoal)]">
              Luméra
            </h1>
            <p className="text-xs font-light tracking-widest uppercase text-[var(--text-muted)]">
              {tHeader('beautyAcademy')}
            </p>
          </Link>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--charcoal)] mb-2">
            {t('createAccount')}
          </h2>
          <p className="text-[var(--text-secondary)] font-light mb-6 sm:mb-8">
            {t('joinPlatform')}
          </p>

          {/* User Type Toggle - 44px touch targets */}
          <div className="flex mb-6 sm:mb-8 p-1 bg-[var(--cream)] rounded-sm">
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`flex-1 min-h-[44px] text-sm font-medium rounded-sm transition-all ${
                userType === 'student'
                  ? 'bg-white text-[var(--charcoal)] shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {t('wantToLearn')}
            </button>
            <button
              type="button"
              onClick={() => setUserType('educator')}
              className={`flex-1 min-h-[44px] text-sm font-medium rounded-sm transition-all ${
                userType === 'educator'
                  ? 'bg-white text-[var(--charcoal)] shadow-sm'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {t('wantToTeach')}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-light text-[var(--text-secondary)] mb-1.5 sm:mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-premium"
                placeholder={t('fullNamePlaceholder')}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-light text-[var(--text-secondary)] mb-1.5 sm:mb-2">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-premium"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Specialty (Educator only) */}
            {userType === 'educator' && (
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-1.5 sm:mb-2">
                  {t('primarySpecialty')}
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="select-premium"
                  required
                >
                  <option value="">{t('selectSpecialty')}</option>
                  <option value="skincare">{t('specialties.skincare')}</option>
                  <option value="laser-devices">{t('specialties.laser')}</option>
                  <option value="brow-lash">{t('specialties.browLash')}</option>
                  <option value="pmu">{t('specialties.pmu')}</option>
                  <option value="aesthetics-needle">{t('specialties.aestheticsNeedle')}</option>
                  <option value="needle-free-aesthetics">{t('specialties.needleFree')}</option>
                  <option value="beauty-business">{t('specialties.business')}</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-light text-[var(--text-secondary)] mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-premium pr-14"
                  placeholder={t('fullNamePlaceholder')}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                {t('minChars')}
              </p>
            </div>

            {/* Terms - 44px touch target for checkbox */}
            <div className="flex items-start space-x-3">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`w-6 h-6 mt-0.5 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors touch-action-manipulation ${
                  agreed
                    ? 'bg-[var(--champagne)] border-[var(--champagne)]'
                    : 'border-[var(--border)]'
                }`}
                style={{ minWidth: '24px', minHeight: '24px' }}
                aria-checked={agreed}
                role="checkbox"
              >
                {agreed && <Check className="w-4 h-4 text-white" />}
              </button>
              <p className="text-sm font-light text-[var(--text-secondary)]">
                {t('agreeTerms')}{' '}
                <Link href="/terms" className="text-[var(--champagne)] hover:underline">
                  {t('termsOfService')}
                </Link>{' '}
                {t('and')}{' '}
                <Link href="/privacy" className="text-[var(--champagne)] hover:underline">
                  {t('privacyPolicy')}
                </Link>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('creatingAccount') : t('createAccountBtn')}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm font-light text-[var(--text-secondary)] mt-6 sm:mt-8">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-[var(--champagne)] hover:underline">
              {tCommon('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
