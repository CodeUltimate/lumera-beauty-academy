'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, Clock, MoreVertical, Edit, Trash2, Radio, Search, Loader2, AlertCircle, Filter, X, ChevronDown } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { classesApi, LiveClass, Category, SkillLevel, ApiError, LiveClassFilters } from '@/lib/api';
import { formatDate, formatTime, formatPrice } from '@/lib/utils';

type TabType = 'upcoming' | 'past' | 'draft';

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'ALL_LEVELS', label: 'All Levels' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

export default function EducatorClassesPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType | null;

  // Base state
  const [activeTab, setActiveTab] = useState<TabType>(tabParam && ['upcoming', 'past', 'draft'].includes(tabParam) ? tabParam : 'upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await classesApi.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const buildFilters = useCallback((): LiveClassFilters => {
    const filters: LiveClassFilters = {
      filter: activeTab,
    };

    if (searchQuery.trim()) filters.search = searchQuery.trim();
    if (selectedCategory) filters.categoryId = selectedCategory;
    if (selectedSkillLevel) filters.skillLevel = selectedSkillLevel;
    if (startDate) filters.startDate = new Date(startDate).toISOString();
    if (endDate) {
      // Set end date to end of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filters.endDate = end.toISOString();
    }

    return filters;
  }, [activeTab, searchQuery, selectedCategory, selectedSkillLevel, startDate, endDate]);

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = buildFilters();
      const response = await classesApi.getMyClasses(filters);
      setClasses(response.content);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load classes');
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  }, [buildFilters]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCancelClass = async (classId: string) => {
    if (!confirm('Are you sure you want to cancel this class?')) return;

    try {
      await classesApi.cancelClass(classId);
      fetchClasses();
      setOpenMenu(null);
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message || 'Failed to cancel class');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSkillLevel('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedSkillLevel || startDate || endDate || searchQuery;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              href="/educator"
              className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-extralight text-[var(--charcoal)]">My Classes</h1>
            <p className="text-[var(--text-secondary)] font-light mt-1">
              Manage and organize your classes
            </p>
          </div>
          <Link href="/educator/create" className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Class</span>
          </Link>
        </div>

        {/* Tabs and Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-[var(--cream)] rounded-sm">
              {(['upcoming', 'past', 'draft'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-light rounded-sm transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-white text-[var(--charcoal)] shadow-sm'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search and Filter Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes..."
                  className="input-premium py-2 text-sm w-full"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-light border rounded-sm transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'border-[var(--champagne)] bg-[var(--champagne)]/10 text-[var(--champagne)]'
                    : 'border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--champagne)]'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-[var(--champagne)]" />
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="card-premium p-4">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-premium py-2 text-sm w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Skill Level Filter */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Skill Level
                  </label>
                  <select
                    value={selectedSkillLevel}
                    onChange={(e) => setSelectedSkillLevel(e.target.value as SkillLevel | '')}
                    className="input-premium py-2 text-sm w-full"
                  >
                    <option value="">Any Level</option>
                    {SKILL_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-premium py-2 text-sm w-full"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-premium py-2 text-sm w-full"
                  />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-1 px-4 py-2 text-sm font-light text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--champagne)]" />
          </div>
        ) : (
          /* Classes List */
          <div className="space-y-4">
            {classes.length > 0 ? (
              classes.map((liveClass) => (
                <div key={liveClass.id} className="card-premium p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)]">
                          {liveClass.category.name}
                        </span>
                        <span className="text-xs font-light text-[var(--text-muted)]">
                          • {liveClass.enrollmentCount} enrolled
                        </span>
                        {liveClass.status === 'LIVE' && (
                          <div className="flex items-center space-x-1 live-badge">
                            <Radio className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-medium text-red-500 uppercase">Live</span>
                          </div>
                        )}
                        {liveClass.status === 'DRAFT' && (
                          <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--cream)] px-2 py-0.5 rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-light text-[var(--charcoal)]">
                        {liveClass.title}
                      </h3>
                      <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                        {SKILL_LEVELS.find(l => l.value === liveClass.skillLevel)?.label || liveClass.skillLevel}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-sm font-light text-[var(--text-secondary)]">
                        {liveClass.scheduledAt ? (
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(liveClass.scheduledAt)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(liveClass.scheduledAt)}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-[var(--text-muted)] italic">Not scheduled</span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-light text-[var(--charcoal)]">
                          {formatPrice(liveClass.price)}
                        </p>
                        <p className="text-xs font-light text-[var(--text-muted)]">per student</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {(liveClass.status === 'SCHEDULED' || liveClass.status === 'LIVE') && (
                          <Link
                            href={`/classroom/${liveClass.id}`}
                            className="btn-primary whitespace-nowrap"
                          >
                            {liveClass.status === 'LIVE' ? 'Join' : 'Go Live'}
                          </Link>
                        )}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === liveClass.id ? null : liveClass.id)}
                            className="p-2 hover:bg-[var(--cream)] rounded transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-[var(--text-muted)]" />
                          </button>
                          {openMenu === liveClass.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-[var(--border-light)] rounded shadow-lg py-1 z-10">
                              {(liveClass.status === 'SCHEDULED' || liveClass.status === 'DRAFT') && (
                                <Link
                                  href={`/educator/classes/${liveClass.id}/edit`}
                                  className="w-full px-4 py-2 text-left text-sm font-light text-[var(--text-secondary)] hover:bg-[var(--cream)] flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Class</span>
                                </Link>
                              )}
                              {(liveClass.status === 'SCHEDULED' || liveClass.status === 'DRAFT') && (
                                <button
                                  onClick={() => handleCancelClass(liveClass.id)}
                                  className="w-full px-4 py-2 text-left text-sm font-light text-red-500 hover:bg-red-50 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Cancel Class</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 card-premium">
                <p className="text-[var(--text-muted)] font-light mb-4">
                  {hasActiveFilters
                    ? 'No classes found matching your filters'
                    : activeTab === 'draft'
                    ? 'No draft classes'
                    : activeTab === 'upcoming'
                    ? 'No upcoming classes scheduled'
                    : 'No past classes'}
                </p>
                {hasActiveFilters ? (
                  <button onClick={clearFilters} className="btn-secondary">
                    Clear Filters
                  </button>
                ) : (
                  <Link href="/educator/create" className="btn-primary">
                    Create Your First Class
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
