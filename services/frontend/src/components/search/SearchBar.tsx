'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { mockLiveClasses, mockEducators } from '@/data/mockData';
import { getVisibleCategories } from '@/data/categories';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';

interface QuickResult {
  type: 'class' | 'educator' | 'category';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const popularSearches = [
  'Russian lips',
  'Microblading',
  'Laser treatment',
  'Lash extensions',
];

const RECENT_SEARCHES_KEY = 'lumera_recent_searches';
const MAX_RECENT_SEARCHES = 5;

interface SearchBarProps {
  variant?: 'header' | 'mobile';
  onClose?: () => void;
}

export default function SearchBar({ variant = 'header', onClose }: SearchBarProps) {
  const router = useRouter();
  const t = useTranslations('search');
  const tCommon = useTranslations('common');
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        localStorage.removeItem(RECENT_SEARCHES_KEY);
      }
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results
  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return { all: [], counts: { all: 0, classes: 0, educators: 0, categories: 0 } };
    }

    const lowerQuery = query.toLowerCase();
    const all: QuickResult[] = [];

    // Search classes
    mockLiveClasses
      .filter(c =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
        c.educator.name.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 3)
      .forEach(c => {
        all.push({
          type: 'class',
          id: c.id,
          title: c.title,
          subtitle: `${c.educator.name} • ${c.category.name}`,
          href: `/live-classes/${c.id}`,
        });
      });

    // Search educators
    mockEducators
      .filter(e =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.specialty.some(s => s.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 2)
      .forEach(e => {
        all.push({
          type: 'educator',
          id: e.id,
          title: e.name,
          subtitle: e.specialty.join(', '),
          href: `/educators/${e.id}`,
        });
      });

    // Search categories
    getVisibleCategories()
      .filter(c => c.name.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .forEach(c => {
        all.push({
          type: 'category',
          id: c.id,
          title: c.name,
          subtitle: 'Category',
          href: `/category/${c.slug}`,
        });
      });

    return {
      all: all.slice(0, 6),
      counts: {
        all: all.length,
        classes: mockLiveClasses.filter(c =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.tags.some(t => t.toLowerCase().includes(lowerQuery))
        ).length,
        educators: mockEducators.filter(e =>
          e.name.toLowerCase().includes(lowerQuery) ||
          e.specialty.some(s => s.toLowerCase().includes(lowerQuery))
        ).length,
        categories: getVisibleCategories().filter(c =>
          c.name.toLowerCase().includes(lowerQuery)
        ).length,
      },
    };
  }, [query]);

  // Keyboard navigation
  const selectableItems = useMemo(() => {
    if (query.length >= 2) return results.all;
    return [...recentSearches.map(s => ({ type: 'recent' as const, value: s })), ...popularSearches.map(s => ({ type: 'popular' as const, value: s }))];
  }, [query, results.all, recentSearches]);

  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev < selectableItems.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : selectableItems.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectableItems[selectedIndex]) {
            const item = selectableItems[selectedIndex];
            if ('href' in item) {
              handleResultClick(item.href);
            } else {
              executeSearch(item.value);
            }
          } else if (query.trim()) {
            executeSearch(query);
          }
          break;
        case 'Escape':
          setIsFocused(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, selectedIndex, selectableItems, query]);

  const executeSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const trimmed = searchQuery.trim();

    // Save to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });

    setQuery('');
    setIsFocused(false);
    onClose?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleResultClick = (href: string) => {
    setQuery('');
    setIsFocused(false);
    onClose?.();
    router.push(href);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const showDropdown = isFocused && (query.length >= 2 || recentSearches.length > 0 || popularSearches.length > 0);

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[var(--champagne-light)] text-[var(--charcoal)] rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative ${variant === 'mobile' ? 'w-full' : 'w-full max-w-md'}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={tCommon('searchPlaceholder')}
          className={`w-full pl-10 pr-10 bg-[var(--cream-light)] border border-[var(--champagne)] rounded-full text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[var(--champagne)] transition-all ${
            variant === 'mobile' ? 'py-3' : 'py-2.5'
          }`}
          aria-label="Search"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border-light)] rounded-lg shadow-xl overflow-hidden z-50"
          role="listbox"
        >
          {/* Results */}
          {query.length >= 2 && results.all.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('results')}
                </span>
                <span className="text-xs text-[var(--champagne)]">
                  {t('found', { count: results.counts.all })}
                </span>
              </div>
              {results.all.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result.href)}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-left transition-colors ${
                    selectedIndex === index
                      ? 'bg-[var(--cream)]'
                      : 'hover:bg-[var(--cream-light)]'
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedIndex === index
                        ? 'bg-[var(--champagne)] text-white'
                        : 'bg-[var(--champagne-light)] text-[var(--champagne)]'
                    }`}
                  >
                    {result.type === 'class' && <Sparkles className="w-4 h-4" />}
                    {result.type === 'educator' && (
                      <span className="text-xs font-medium">{getInitials(result.title)}</span>
                    )}
                    {result.type === 'category' && <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--charcoal)] truncate">
                      {highlightMatch(result.title)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{result.subtitle}</p>
                  </div>
                </button>
              ))}

              {/* View all link */}
              <button
                onClick={() => executeSearch(query)}
                className="flex items-center justify-center gap-2 w-full mt-2 py-2.5 text-sm text-[var(--champagne)] hover:bg-[var(--cream-light)] rounded-lg transition-colors"
              >
                <span>{t('viewAllResults', { count: results.counts.all })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && results.all.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-[var(--text-muted)]">{t('noResults', { query })}</p>
              <button
                onClick={() => executeSearch(query)}
                className="mt-2 text-sm text-[var(--champagne)] hover:underline"
              >
                {t('searchAllContent')}
              </button>
            </div>
          )}

          {/* Recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2 border-b border-[var(--border-light)]">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  {t('recent')}
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--champagne)]"
                >
                  {t('clear')}
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search}
                  onClick={() => executeSearch(search)}
                  className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${
                    selectedIndex === index
                      ? 'bg-[var(--cream)]'
                      : 'hover:bg-[var(--cream-light)]'
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm text-[var(--text-secondary)]">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular searches */}
          {!query && (
            <div className="p-2">
              <span className="block px-2 mb-1 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                {t('popular')}
              </span>
              <div className="flex flex-wrap gap-1.5 px-1">
                {popularSearches.map((search, index) => {
                  const adjustedIndex = recentSearches.length + index;
                  return (
                    <button
                      key={search}
                      onClick={() => executeSearch(search)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        selectedIndex === adjustedIndex
                          ? 'bg-[var(--champagne)] text-white'
                          : 'bg-[var(--cream-light)] text-[var(--text-secondary)] hover:bg-[var(--cream)]'
                      }`}
                      role="option"
                      aria-selected={selectedIndex === adjustedIndex}
                    >
                      {search}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
