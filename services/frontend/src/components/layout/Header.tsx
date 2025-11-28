'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { getVisibleCategories } from '@/data/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main header bar - 56px mobile, 80px desktop */}
        <div className="flex items-center justify-between h-14 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 min-h-[44px]">
            <span className="text-xl lg:text-2xl font-light tracking-tight text-[var(--charcoal)]">
              Luméra
            </span>
            <span className="text-xs font-light tracking-widest uppercase text-[var(--text-muted)] hidden sm:inline">
              Beauty Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/live-classes"
              className="text-sm font-light tracking-wide text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2"
            >
              Live Classes
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 150)}
                className="flex items-center space-x-1 text-sm font-light tracking-wide text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[var(--border-light)] rounded shadow-lg py-2 max-h-[60vh] overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2.5 text-sm font-light text-[var(--text-secondary)] hover:bg-[var(--cream)] hover:text-[var(--champagne)] transition-colors"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/educators"
              className="text-sm font-light tracking-wide text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2"
            >
              Educators
            </Link>

            <Link
              href="/about"
              className="text-sm font-light tracking-wide text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2"
            >
              About
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/login"
              className="text-sm font-light tracking-wide text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors py-2 px-3"
            >
              Sign In
            </Link>

            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button - 44px touch target */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--charcoal)] -mr-2"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                Live Classes
              </Link>

              {/* Categories Section */}
              <div className="py-2 border-t border-[var(--border-light)] mt-2">
                <p className="text-xs font-medium tracking-widest uppercase text-[var(--text-muted)] py-2">
                  Categories
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
                Educators
              </Link>

              <Link
                href="/about"
                className="flex items-center min-h-[44px] text-base font-light tracking-wide text-[var(--text-secondary)] active:text-[var(--champagne)] active:bg-[var(--cream)] -mx-4 px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Auth Section */}
              <div className="pt-4 mt-2 border-t border-[var(--border-light)] space-y-2 pb-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center min-h-[44px] text-base font-light tracking-wide text-[var(--text-secondary)] border border-[var(--border)] rounded-sm active:bg-[var(--cream)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
