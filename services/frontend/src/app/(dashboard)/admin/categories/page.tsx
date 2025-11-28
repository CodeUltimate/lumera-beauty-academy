'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Pencil, Eye, EyeOff, Loader2, Search, AlertCircle,
  Check, X, Layers, ChevronLeft, ChevronRight, Filter, ChevronDown
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { classesApi, Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/api/classes';

const PAGE_SIZE = 10;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    slug: '',
    description: '',
    icon: '',
    imageUrl: '',
    visible: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await classesApi.getAllCategories();
      setCategories(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        imageUrl: category.imageUrl || '',
        visible: category.visible,
        displayOrder: category.displayOrder,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        imageUrl: '',
        visible: true,
        displayOrder: categories.length,
      });
    }
    setSaveError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setSaveError(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: !editingCategory ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSaveError('Category name is required');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (editingCategory) {
        await classesApi.updateCategory(editingCategory.id, formData as UpdateCategoryRequest);
      } else {
        await classesApi.createCategory(formData);
      }
      await fetchCategories();
      handleCloseModal();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setSaveError(error.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (category: Category) => {
    try {
      await classesApi.toggleCategoryVisibility(category.id);
      setCategories(prev =>
        prev.map(c =>
          c.id === category.id ? { ...c, visible: !c.visible } : c
        )
      );
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all';

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'visible' && category.visible) ||
      (statusFilter === 'hidden' && !category.visible);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / PAGE_SIZE);
  const paginatedCategories = filteredCategories.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, statusFilter]);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extralight text-[var(--charcoal)]">Categories</h1>
            <p className="text-sm text-[var(--text-secondary)] font-light mt-1">
              Manage class categories
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 md:max-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium py-2 text-sm w-full"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Filter Toggle */}
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

            {/* Stats */}
            {!isLoading && categories.length > 0 && (
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] md:ml-auto">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {categories.filter(c => c.visible).length} visible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  {categories.filter(c => !c.visible).length} hidden
                </span>
              </div>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="card-premium p-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                {/* Status Filter */}
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'visible' | 'hidden')}
                    className="input-premium py-2 text-sm w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="visible">Visible Only</option>
                    <option value="hidden">Hidden Only</option>
                  </select>
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

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[var(--champagne)] animate-spin" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 card-premium">
            <p className="text-[var(--text-muted)] font-light mb-4">
              {hasActiveFilters
                ? 'No categories found matching your filters'
                : 'No categories yet'}
            </p>
            {hasActiveFilters ? (
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => handleOpenModal()}
                className="btn-primary"
              >
                Add Your First Category
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginatedCategories.map((category) => (
                <div
                  key={category.id}
                  className={`card-premium p-3 overflow-hidden ${!category.visible ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[var(--charcoal)] leading-tight">
                        {category.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        /{category.slug} · Order {category.displayOrder}
                      </p>
                      {category.description && (
                        <p className="text-[11px] text-[var(--text-muted)] mt-1.5 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 ${
                        category.visible
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {category.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="p-2 rounded-lg hover:bg-[var(--cream)] text-[var(--text-muted)]"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(category)}
                        className="p-2 rounded-lg hover:bg-[var(--cream)] text-[var(--text-muted)]"
                      >
                        {category.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block card-premium overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-[var(--cream)]">
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 w-16">
                      Order
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 w-32">
                      Slug
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 w-24">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider px-4 py-3 w-28">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-light)]">
                  {paginatedCategories.map((category) => (
                    <tr
                      key={category.id}
                      className={`hover:bg-[var(--cream)]/50 transition-colors ${
                        !category.visible ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <span className="text-sm text-[var(--text-muted)] font-mono">
                          {category.displayOrder}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--charcoal)]">
                            {category.name}
                          </p>
                          {category.description && (
                            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 max-w-lg">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <code className="text-xs text-[var(--text-secondary)] bg-[var(--cream)] px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          category.visible
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {category.visible ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(category)}
                            className="p-2 rounded-lg hover:bg-[var(--beige)] text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleVisibility(category)}
                            className="p-2 rounded-lg hover:bg-[var(--beige)] text-[var(--text-muted)] hover:text-[var(--charcoal)] transition-colors"
                            title={category.visible ? 'Hide' : 'Show'}
                          >
                            {category.visible ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 mt-4 card-premium">
                <p className="text-xs text-[var(--text-muted)]">
                  Showing {currentPage * PAGE_SIZE + 1}-{Math.min((currentPage + 1) * PAGE_SIZE, filteredCategories.length)} of {filteredCategories.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg hover:bg-[var(--cream)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === i
                          ? 'bg-[var(--champagne)] text-white'
                          : 'text-[var(--text-muted)] hover:bg-[var(--cream)]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg hover:bg-[var(--cream)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full">
            <div className="bg-white rounded-t-xl sm:rounded-xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-light)] flex-shrink-0">
                <h2 className="text-base font-medium text-[var(--charcoal)]">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-lg hover:bg-[var(--cream)]"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4 overflow-y-auto flex-1">
                {saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700">{saveError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-premium text-sm w-full"
                    placeholder="Makeup Artistry"
                  />
                  {formData.name && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Slug: <span className="font-mono">{formData.slug || generateSlug(formData.name)}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-premium text-sm w-full resize-none"
                    rows={2}
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="input-premium text-sm w-20"
                    min={0}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[var(--charcoal)]">Visible</p>
                    <p className="text-xs text-[var(--text-muted)]">Show to educators</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      formData.visible ? 'bg-[var(--champagne)]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        formData.visible ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-[var(--border-light)] flex-shrink-0">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 text-sm font-medium text-[var(--charcoal)] bg-[var(--cream)] rounded-lg hover:bg-[var(--beige)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !formData.name.trim()}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-[var(--champagne)] rounded-lg hover:bg-[var(--champagne-dark)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingCategory ? 'Update' : 'Create'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
