'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getVisibleCategories } from '@/data/categories';
import SearchBar from '@/components/search/SearchBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('common');
  const tHeader = useTranslations('header');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const categories = getVisibleCategories();

  // Close menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--border-light)] safe-area-top">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main header bar - 56px mobile, 80px desktop */}
        <div className="flex items-center h-14 lg:h-16 gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 min-h-[44px] flex-shrink-0">
            <span className="text-xl lg:text-2xl font-light tracking-tight text-[var(--charcoal)]">
              Luméra
            </span>
            <span className="text-xs font-light tracking-widest uppercase text-[var(--text-muted)] hidden sm:inline">
              {tHeader('beautyAcademy')}
            </span>
          </Link>

          {/* Categories Dropdown - Desktop */}
          <div className="relative hidden lg:block flex-shrink-0">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 150)}
              className="flex items-center space-x-1.5 text-sm font-medium text-[var(--charcoal)] hover:text-[var(--champagne)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--cream-light)]"
            >
              <Menu className="w-4 h-4" />
              <span>{t('categories')}</span>
            </button>

            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[var(--border-light)] rounded-lg shadow-xl py-2 max-h-[60vh] overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--cream)] hover:text-[var(--champagne)] transition-colors"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar - Desktop (takes remaining space) */}
          <div className="hidden lg:block flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <Link
              href="/live-classes"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--cream-light)]"
            >
              {t('liveClasses')}
            </Link>

            <Link
              href="/educators"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--cream-light)]"
            >
              {t('educators')}
            </Link>
          </nav>

          {/* Divider */}
          <div className="hidden lg:block w-px h-6 bg-[var(--border-light)] flex-shrink-0" />

          {/* Auth Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <LanguageSwitcher />

            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--cream-light)]"
            >
              {t('signIn')}
            </Link>

            <Link href="/register" className="btn-primary text-sm">
              {t('getStarted')}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-1 ml-auto">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--champagne)]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button - 44px touch target */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--charcoal)] -mr-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu - Full screen overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
            style={{ top: '56px' }}
          />

          {/* Menu Panel */}
          <div
            className="lg:hidden fixed left-0 right-0 bg-white border-t border-[var(--border-light)] z-50 overflow-y-auto"
            style={{
              top: '56px',
              maxHeight: 'calc(100vh - 56px - env(safe-area-inset-bottom))'
            }}
          >
            <nav className="px-4 py-2 safe-area-bottom">
              {/* Main links with 44px touch targets */}
              <Link
                href="/live-classes"
                className="flex items-center min-h-[44px] text-base font-light tracking-wide text-[var(--text-secondary)] active:text-[var(--champagne)] active:bg-[var(--cream)] -mx-4 px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('liveClasses')}
              </Link>

              {/* Categories Section */}
              <div className="py-2 border-t border-[var(--border-light)] mt-2">
                <p className="text-xs font-medium tracking-widest uppercase text-[var(--text-muted)] py-2">
                  {t('categories')}
                </p>
                <div className="space-y-0">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="flex items-center min-h-[44px] text-base font-light text-[var(--text-secondary)] pl-4 active:text-[var(--champagne)] active:bg-[var(--cream)] -mx-4 px-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/educators"
                className="flex items-center min-h-[44px] text-base font-light tracking-wide text-[var(--text-secondary)] active:text-[var(--champagne)] active:bg-[var(--cream)] -mx-4 px-4 border-t border-[var(--border-light)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('educators')}
              </Link>

              <Link
                href="/about"
                className="flex items-center min-h-[44px] text-base font-light tracking-wide text-[var(--text-secondary)] active:text-[var(--champagne)] active:bg-[var(--cream)] -mx-4 px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('about')}
              </Link>

              {/* Auth Section */}
              <div className="pt-4 mt-2 border-t border-[var(--border-light)] space-y-2 pb-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center min-h-[44px] text-base font-light tracking-wide text-[var(--text-secondary)] border border-[var(--border)] rounded-sm active:bg-[var(--cream)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/register"
                  className="btn-primary w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('getStarted')}
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 safe-area-top">
          <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--border-light)]">
            <div className="flex-1">
              <SearchBar variant="mobile" onClose={() => setIsMobileSearchOpen(false)} />
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-secondary)]"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
