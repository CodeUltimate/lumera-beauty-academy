'use client';

import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LiveClassCard from '@/components/ui/LiveClassCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import { getVisibleCategories } from '@/data/categories';
import { mockLiveClasses } from '@/data/mockData';

export default function LiveClassesPage() {
  const t = useTranslations('liveClasses');
  const tCommon = useTranslations('common');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const categories = getVisibleCategories();

  const filteredClasses = mockLiveClasses
    .filter((c) => (selectedCategory ? c.categoryId === selectedCategory : true))
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.educator.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      }
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      {/* Responsive padding: accounts for header height (56px mobile, 80px desktop) */}
      <div className="pt-20 lg:pt-28 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-3 sm:mb-4">
              {t('pageTitle')}
            </h1>
            <p className="text-base sm:text-lg font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t('pageDescription')}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 sm:mb-8 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="input-premium pl-12"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-premium w-full sm:w-48"
              >
                <option value="date">{t('sortByDate')}</option>
                <option value="price-low">{tCommon('priceLowHigh')}</option>
                <option value="price-high">{tCommon('priceHighLow')}</option>
              </select>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* Results Count */}
          <p className="text-sm font-light text-[var(--text-muted)] mb-4 sm:mb-6">
            {t('showingClasses', { count: filteredClasses.length })}
          </p>

          {/* Classes Grid - progressive breakpoints */}
          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredClasses.map((liveClass) => (
                <LiveClassCard key={liveClass.id} liveClass={liveClass} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <p className="text-base sm:text-lg font-light text-[var(--text-muted)]">
                {t('noClassesFound')}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="btn-secondary mt-4"
              >
                {tCommon('clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
