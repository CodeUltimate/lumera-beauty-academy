'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type UserType = 'student' | 'educator';

export default function RegisterPage() {
  const router = useRouter();
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
            Start Your Journey
          </h2>
          <p className="text-lg font-light text-white/70 leading-relaxed">
            Whether you want to learn from the best or share your expertise with the world,
            Luméra is your platform for growth.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3 text-white/80">
              <Check className="w-5 h-5 text-[var(--champagne)]" />
              <span className="font-light">Access to live masterclasses</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <Check className="w-5 h-5 text-[var(--champagne)]" />
              <span className="font-light">Verified certificates</span>
            </div>
            <div className="flex items-center space-x-3 text-white/80">
              <Check className="w-5 h-5 text-[var(--champagne)]" />
              <span className="font-light">Global community access</span>
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
              Beauty Academy
            </p>
          </Link>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extralight text-[var(--charcoal)] mb-2">
            Create your account
          </h2>
          <p className="text-[var(--text-secondary)] font-light mb-6 sm:mb-8">
            Join the premier beauty education platform
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
              I want to learn
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
              I want to teach
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
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-premium"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-light text-[var(--text-secondary)] mb-1.5 sm:mb-2">
                Email Address
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
                  Primary Specialty
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="select-premium"
                  required
                >
                  <option value="">Select your specialty</option>
                  <option value="skincare">Skincare</option>
                  <option value="laser-devices">Laser & Devices</option>
                  <option value="brow-lash">Brow & Lash</option>
                  <option value="pmu">PMU</option>
                  <option value="aesthetics-needle">Aesthetics (Needle)</option>
                  <option value="needle-free-aesthetics">Needle-Free Aesthetics</option>
                  <option value="beauty-business">Beauty Business & Marketing</option>
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
                  placeholder="Create a password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                Minimum 8 characters
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
                I agree to the{' '}
                <Link href="/terms" className="text-[var(--champagne)] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[var(--champagne)] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !agreed}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm font-light text-[var(--text-secondary)] mt-6 sm:mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--champagne)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
