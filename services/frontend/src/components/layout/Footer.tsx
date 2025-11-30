'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getVisibleCategories } from '@/data/categories';

export default function Footer() {
  const t = useTranslations('footer');
  const categories = getVisibleCategories();

  return (
    <footer className="bg-[var(--plum)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-light tracking-tight">Luméra</h3>
              <p className="text-xs font-light tracking-widest uppercase text-white/60">
                {t('beautyAcademy')}
              </p>
            </div>
            <p className="text-sm font-light text-white/70 leading-relaxed">
              {t('tagline')}
            </p>
            <p className="text-sm font-light text-white/50 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/60 mb-4">
              {t('categories')}
            </h4>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/60 mb-4">
              {t('company')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/become-educator"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('becomeEducator')}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('careers')}
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('press')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-white/60 mb-4">
              {t('support')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm font-light text-white/70 hover:text-[var(--champagne)] transition-colors"
                >
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs font-light text-white/40">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="#"
                className="text-xs font-light text-white/40 hover:text-white/70 transition-colors"
              >
                {t('instagram')}
              </Link>
              <Link
                href="#"
                className="text-xs font-light text-white/40 hover:text-white/70 transition-colors"
              >
                {t('linkedin')}
              </Link>
              <Link
                href="#"
                className="text-xs font-light text-white/40 hover:text-white/70 transition-colors"
              >
                {t('youtube')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
