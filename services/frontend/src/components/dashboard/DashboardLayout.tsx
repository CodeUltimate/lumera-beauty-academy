'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Calendar,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Users,
  DollarSign,
  BarChart3,
  CheckCircle,
  Layers,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const studentNavItems = [
  { href: '/student', label: 'Dashboard', icon: Home },
  { href: '/student/classes', label: 'My Classes', icon: BookOpen },
  { href: '/student/calendar', label: 'Calendar', icon: Calendar },
  { href: '/student/certificates', label: 'Certificates', icon: Award },
  { href: '/student/settings', label: 'Settings', icon: Settings },
];

const educatorNavItems = [
  { href: '/educator', label: 'Dashboard', icon: Home },
  { href: '/educator/classes', label: 'Classes', icon: BookOpen },
  { href: '/educator/create', label: 'Create', icon: Plus },
  { href: '/educator/students', label: 'Students', icon: Users },
  { href: '/educator/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/educator/settings', label: 'Settings', icon: Settings },
];

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/educators', label: 'Educators', icon: Users },
  { href: '/admin/approvals', label: 'Approvals', icon: CheckCircle },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  // Derive user info from auth context
  const userName = user ? `${user.firstName} ${user.lastName}` : '';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const userRole: UserRole = user?.role?.toLowerCase() as UserRole || 'student';

  const navItems =
    userRole === 'admin'
      ? adminNavItems
      : userRole === 'educator'
      ? educatorNavItems
      : studentNavItems;

  const roleLabel =
    userRole === 'admin' ? 'Administrator' : userRole === 'educator' ? 'Educator' : 'Student';

  // Mobile bottom nav - show first 4 items + more
  const mobileNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  const handleLogout = async () => {
    setIsSidebarOpen(false);
    setIsMoreMenuOpen(false);
    await logout();
  };

  const isActive = (href: string) => {
    const isDashboardRoot = href === '/educator' || href === '/student' || href === '/admin';
    return isDashboardRoot
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--cream-light)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--champagne)]" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--cream-light)]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[var(--border-light)] px-4 flex items-center justify-between safe-area-top">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-light tracking-tight text-[var(--charcoal)]">Luméra</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center space-x-2 p-1.5 -mr-1.5"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
            <span className="text-xs font-light text-[var(--charcoal)]">{userInitials}</span>
          </div>
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-[var(--border-light)]">
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-[var(--border-light)]">
          <Link href="/">
            <h1 className="text-xl font-light tracking-tight text-[var(--charcoal)]">Luméra</h1>
            <p className="text-[10px] font-light tracking-widest uppercase text-[var(--text-muted)]">
              Beauty Academy
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-sm text-sm font-light transition-colors',
                    isActive(item.href)
                      ? 'bg-[var(--champagne)]/10 text-[var(--champagne)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--cream)] hover:text-[var(--charcoal)]'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--border-light)]">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
                <span className="text-xs font-light text-[var(--charcoal)]">{userInitials}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--charcoal)]">{userName}</p>
                <p className="text-xs font-light text-[var(--text-muted)]">{roleLabel}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--charcoal)] hover:bg-[var(--cream)] rounded transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-out Menu */}
      {isSidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="lg:hidden fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl animate-slide-in-right">
            {/* Menu Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border-light)]">
              <span className="text-sm font-medium text-[var(--charcoal)]">Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 -mr-2 text-[var(--text-secondary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="px-4 py-4 border-b border-[var(--border-light)]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
                  <span className="text-sm font-light text-[var(--charcoal)]">{userInitials}</span>
                </div>
                <div>
                  <p className="text-base font-medium text-[var(--charcoal)]">{userName}</p>
                  <p className="text-sm font-light text-[var(--text-muted)]">{roleLabel}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-2 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-light transition-colors',
                        isActive(item.href)
                          ? 'bg-[var(--champagne)]/10 text-[var(--champagne)]'
                          : 'text-[var(--text-secondary)] active:bg-[var(--cream)]'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sign Out */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-light)] safe-area-bottom">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-base font-light text-red-600 bg-red-50 rounded-lg active:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[var(--border-light)] safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors',
                isActive(item.href)
                  ? 'text-[var(--champagne)]'
                  : 'text-[var(--text-muted)]'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-light">{item.label}</span>
            </Link>
          ))}

          {/* More button for additional items */}
          {moreNavItems.length > 0 && (
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full px-1 transition-colors',
                isMoreMenuOpen || moreNavItems.some(item => isActive(item.href))
                  ? 'text-[var(--champagne)]'
                  : 'text-[var(--text-muted)]'
              )}
            >
              <MoreHorizontal className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-light">More</span>
            </button>
          )}
        </div>

        {/* More Menu Popup */}
        {isMoreMenuOpen && moreNavItems.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsMoreMenuOpen(false)}
            />
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-white rounded-xl shadow-lg border border-[var(--border-light)] overflow-hidden z-40">
              {moreNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3.5 text-sm font-light border-b border-[var(--border-light)] last:border-b-0 transition-colors',
                    isActive(item.href)
                      ? 'bg-[var(--champagne)]/10 text-[var(--champagne)]'
                      : 'text-[var(--text-secondary)] active:bg-[var(--cream)]'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-14 pb-20 lg:pt-0 lg:pb-0">{children}</div>
      </main>

      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out;
        }
        .safe-area-top {
          padding-top: env(safe-area-inset-top);
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
