'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  Clock,
  Users,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react';
import { mockLiveClasses, mockEducators } from '@/data/mockData';
import { getVisibleCategories } from '@/data/categories';
import { LiveClass, Educator } from '@/types';
import { getInitials, formatPrice } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'date' | 'popularity';
type ResultType = 'all' | 'classes' | 'educators';

interface FilterState {
  categories: string[];
  priceRange: { min: number; max: number } | null;
  duration: string | null;
  level: string[];
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [resultType, setResultType] = useState<ResultType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: null,
    duration: null,
    level: [],
  });

  // Update search input when URL changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const categories = getVisibleCategories();

  // Search and filter classes
  const filteredClasses = useMemo(() => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    let results = mockLiveClasses.filter(
      (c) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.educator.name.toLowerCase().includes(lowerQuery) ||
        c.category.name.toLowerCase().includes(lowerQuery) ||
        c.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );

    // Apply category filter
    if (filters.categories.length > 0) {
      results = results.filter((c) => filters.categories.includes(c.categoryId));
    }

    // Apply price filter
    if (filters.priceRange) {
      results = results.filter(
        (c) => c.price >= filters.priceRange!.min && c.price <= filters.priceRange!.max
      );
    }

    // Apply duration filter
    if (filters.duration) {
      switch (filters.duration) {
        case 'short':
          results = results.filter((c) => c.duration <= 60);
          break;
        case 'medium':
          results = results.filter((c) => c.duration > 60 && c.duration <= 120);
          break;
        case 'long':
          results = results.filter((c) => c.duration > 120);
          break;
      }
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'date':
        results.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
        break;
      case 'popularity':
        results.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
        break;
    }

    return results;
  }, [query, filters, sortBy]);

  // Search educators
  const filteredEducators = useMemo(() => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    return mockEducators.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.specialty.some((s) => s.toLowerCase().includes(lowerQuery)) ||
        (e.bio && e.bio.toLowerCase().includes(lowerQuery))
    );
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: null,
      duration: null,
      level: [],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange !== null ||
    filters.duration !== null ||
    filters.level.length > 0;

  const totalResults =
    resultType === 'all'
      ? filteredClasses.length + filteredEducators.length
      : resultType === 'classes'
      ? filteredClasses.length
      : filteredEducators.length;

  return (
    <div className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      <main className="pt-20 lg:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Search Header */}
          <div className="py-8 border-b border-[var(--border-light)]">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for classes, educators, or topics..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[var(--border)] rounded-lg text-lg focus:outline-none focus:border-[var(--champagne)] focus:ring-1 focus:ring-[var(--champagne)]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-6"
                >
                  Search
                </button>
              </div>
            </form>

            {query && (
              <div className="mt-6 text-center">
                <p className="text-[var(--text-secondary)]">
                  <span className="font-medium">{totalResults}</span> results for{' '}
                  <span className="font-medium">&quot;{query}&quot;</span>
                </p>
              </div>
            )}
          </div>

          {query ? (
            <div className="flex flex-col lg:flex-row gap-8 py-8">
              {/* Filters Sidebar - Desktop */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-28">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-medium text-[var(--charcoal)]">Filters</h2>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-[var(--champagne)] hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Result Type */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Show</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Results' },
                        { value: 'classes', label: `Classes (${filteredClasses.length})` },
                        { value: 'educators', label: `Educators (${filteredEducators.length})` },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="resultType"
                            checked={resultType === option.value}
                            onChange={() => setResultType(option.value as ResultType)}
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              resultType === option.value
                                ? 'border-[var(--champagne)]'
                                : 'border-[var(--border)]'
                            }`}
                          >
                            {resultType === option.value && (
                              <span className="w-2 h-2 rounded-full bg-[var(--champagne)]" />
                            )}
                          </span>
                          <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
                              filters.categories.includes(category.id)
                                ? 'bg-[var(--champagne)] border-[var(--champagne)]'
                                : 'border-[var(--border)]'
                            }`}
                          >
                            {filters.categories.includes(category.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                          <span className="text-sm text-[var(--text-secondary)]">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Duration</h3>
                    <div className="space-y-2">
                      {[
                        { value: 'short', label: 'Under 1 hour' },
                        { value: 'medium', label: '1-2 hours' },
                        { value: 'long', label: 'Over 2 hours' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="duration"
                            checked={filters.duration === option.value}
                            onChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                duration: prev.duration === option.value ? null : option.value,
                              }))
                            }
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              filters.duration === option.value
                                ? 'border-[var(--champagne)]'
                                : 'border-[var(--border)]'
                            }`}
                          >
                            {filters.duration === option.value && (
                              <span className="w-2 h-2 rounded-full bg-[var(--champagne)]" />
                            )}
                          </span>
                          <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Price</h3>
                    <div className="space-y-2">
                      {[
                        { value: { min: 0, max: 100 }, label: 'Under $100' },
                        { value: { min: 100, max: 200 }, label: '$100 - $200' },
                        { value: { min: 200, max: 300 }, label: '$200 - $300' },
                        { value: { min: 300, max: 10000 }, label: '$300+' },
                      ].map((option, index) => (
                        <label key={index} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={
                              filters.priceRange?.min === option.value.min &&
                              filters.priceRange?.max === option.value.max
                            }
                            onChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                priceRange:
                                  prev.priceRange?.min === option.value.min &&
                                  prev.priceRange?.max === option.value.max
                                    ? null
                                    : option.value,
                              }))
                            }
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              filters.priceRange?.min === option.value.min &&
                              filters.priceRange?.max === option.value.max
                                ? 'border-[var(--champagne)]'
                                : 'border-[var(--border)]'
                            }`}
                          >
                            {filters.priceRange?.min === option.value.min &&
                              filters.priceRange?.max === option.value.max && (
                                <span className="w-2 h-2 rounded-full bg-[var(--champagne)]" />
                              )}
                          </span>
                          <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Mobile Filter Button */}
              <div className="lg:hidden flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center space-x-2 px-4 py-2 border border-[var(--border)] rounded-lg text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-5 h-5 bg-[var(--champagne)] text-white text-xs rounded-full flex items-center justify-center">
                      {filters.categories.length + (filters.priceRange ? 1 : 0) + (filters.duration ? 1 : 0)}
                    </span>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[var(--text-muted)]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--champagne)]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="date">Date</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                {/* Desktop Sort */}
                <div className="hidden lg:flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-[var(--text-muted)]">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--champagne)]"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="date">Date</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                </div>

                {/* Classes Results */}
                {(resultType === 'all' || resultType === 'classes') && filteredClasses.length > 0 && (
                  <section className="mb-12">
                    {resultType === 'all' && (
                      <h2 className="text-lg font-medium text-[var(--charcoal)] mb-4">
                        Classes ({filteredClasses.length})
                      </h2>
                    )}
                    <div className="space-y-4">
                      {filteredClasses.map((classItem) => (
                        <ClassCard key={classItem.id} classItem={classItem} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Educators Results */}
                {(resultType === 'all' || resultType === 'educators') && filteredEducators.length > 0 && (
                  <section>
                    {resultType === 'all' && (
                      <h2 className="text-lg font-medium text-[var(--charcoal)] mb-4">
                        Educators ({filteredEducators.length})
                      </h2>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredEducators.map((educator) => (
                        <EducatorCard key={educator.id} educator={educator} />
                      ))}
                    </div>
                  </section>
                )}

                {/* No Results */}
                {totalResults === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-[var(--cream)] rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Search className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h2 className="text-xl font-light text-[var(--charcoal)] mb-2">
                      No results found
                    </h2>
                    <p className="text-[var(--text-muted)] mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="btn-secondary">
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-[var(--cream)] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h2 className="text-xl font-light text-[var(--charcoal)] mb-2">
                Search for classes & educators
              </h2>
              <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
                Find the perfect class to advance your beauty skills. Search by topic, educator, or technique.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Russian lips', 'Microblading', 'Laser treatment', 'Business growth', 'Lash extensions'].map(
                  (suggestion) => (
                    <Link
                      key={suggestion}
                      href={`/search?q=${encodeURIComponent(suggestion)}`}
                      className="px-4 py-2 bg-white border border-[var(--border)] rounded-full text-sm text-[var(--text-secondary)] hover:border-[var(--champagne)] hover:text-[var(--champagne)] transition-colors"
                    >
                      {suggestion}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <MobileFiltersModal
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          onClose={() => setShowFilters(false)}
          onClear={clearFilters}
        />
      )}

      <Footer />
    </div>
  );
}

function ClassCard({ classItem }: { classItem: LiveClass }) {
  return (
    <Link
      href={`/live-classes/${classItem.id}`}
      className="block bg-white rounded-lg border border-[var(--border-light)] hover:border-[var(--champagne)] hover:shadow-lg transition-all p-4"
    >
      <div className="flex gap-4">
        {/* Thumbnail placeholder */}
        <div className="w-40 h-24 bg-gradient-to-br from-[var(--cream)] to-[var(--champagne-light)] rounded-lg flex-shrink-0 hidden sm:flex items-center justify-center">
          <span className="text-[var(--champagne)] text-sm font-medium">
            {classItem.category.name}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[var(--charcoal)] line-clamp-2 mb-1">
            {classItem.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-2">
            {classItem.educator.name}
          </p>

          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-2">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-[var(--champagne)]" />
              {classItem.educator.rating}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {classItem.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {classItem.enrolledStudents} enrolled
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-[var(--charcoal)]">
              {formatPrice(classItem.price, classItem.currency)}
            </span>
            <span className="text-xs px-2 py-1 bg-[var(--cream)] text-[var(--champagne)] rounded">
              {classItem.status === 'upcoming' ? 'Upcoming' : classItem.status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EducatorCard({ educator }: { educator: Educator }) {
  return (
    <Link
      href={`/educators/${educator.id}`}
      className="block bg-white rounded-lg border border-[var(--border-light)] hover:border-[var(--champagne)] hover:shadow-lg transition-all p-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--champagne)] to-[var(--champagne-light)] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-medium">{getInitials(educator.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[var(--charcoal)] mb-1">{educator.name}</h3>
          <p className="text-sm text-[var(--text-muted)] line-clamp-1">
            {educator.specialty.join(', ')}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-[var(--champagne)]" />
              {educator.rating}
            </span>
            <span>{educator.totalStudents.toLocaleString()} students</span>
            <span>{educator.totalClasses} classes</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface MobileFiltersModalProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onClear: () => void;
}

function MobileFiltersModal({
  filters,
  setFilters,
  categories,
  onClose,
  onClear,
}: MobileFiltersModalProps) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[var(--border-light)] px-4 py-4 flex items-center justify-between">
          <h2 className="font-medium text-[var(--charcoal)]">Filters</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categories: prev.categories.includes(category.id)
                        ? prev.categories.filter((c) => c !== category.id)
                        : [...prev.categories, category.id],
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    filters.categories.includes(category.id)
                      ? 'bg-[var(--champagne)] text-white border-[var(--champagne)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Duration</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'short', label: 'Under 1 hour' },
                { value: 'medium', label: '1-2 hours' },
                { value: 'long', label: 'Over 2 hours' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      duration: prev.duration === option.value ? null : option.value,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    filters.duration === option.value
                      ? 'bg-[var(--champagne)] text-white border-[var(--champagne)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-medium text-[var(--charcoal)] mb-3">Price</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: { min: 0, max: 100 }, label: 'Under $100' },
                { value: { min: 100, max: 200 }, label: '$100 - $200' },
                { value: { min: 200, max: 300 }, label: '$200 - $300' },
                { value: { min: 300, max: 10000 }, label: '$300+' },
              ].map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange:
                        prev.priceRange?.min === option.value.min &&
                        prev.priceRange?.max === option.value.max
                          ? null
                          : option.value,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    filters.priceRange?.min === option.value.min &&
                    filters.priceRange?.max === option.value.max
                      ? 'bg-[var(--champagne)] text-white border-[var(--champagne)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[var(--border-light)] p-4 flex gap-3">
          <button onClick={onClear} className="btn-secondary flex-1">
            Clear All
          </button>
          <button onClick={onClose} className="btn-primary flex-1">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--cream-light)] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-[var(--champagne)] border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
