'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, DollarSign, Upload, ArrowLeft, Radio, Video, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { classesApi, Category, SkillLevel, ApiError } from '@/lib/api';

type ClassType = 'live' | 'video';

export default function CreateClassPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [classType, setClassType] = useState<ClassType>('live');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    skillLevel: 'ALL_LEVELS' as SkillLevel,
    topics: '',
    requirements: '',
    price: '',
    date: '',
    time: '',
    duration: '60',
    maxStudents: '',
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await classesApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();

    // Validate required fields for publishing
    if (!saveAsDraft && classType === 'live') {
      if (!formData.date || !formData.time) {
        setError('Date and time are required to schedule a class');
        return;
      }
    }

    setIsLoading(true);
    setIsSavingDraft(saveAsDraft);
    setError(null);
    setValidationErrors({});

    try {
      // Combine date and time into ISO string (only if provided)
      let scheduledAt: string | null = null;
      if (formData.date && formData.time) {
        scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      }

      // Parse topics and requirements from comma-separated strings
      const topics = formData.topics
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const requirements = formData.requirements
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      await classesApi.createClass({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        durationMinutes: parseInt(formData.duration, 10),
        maxStudents: formData.maxStudents ? parseInt(formData.maxStudents, 10) : null,
        scheduledAt,
        categoryId: formData.categoryId,
        skillLevel: formData.skillLevel,
        topics: topics.length > 0 ? topics : undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        draft: saveAsDraft,
      });

      // Redirect to appropriate tab
      router.push(saveAsDraft ? '/educator/classes?tab=draft' : '/educator/classes');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.validationErrors) {
        setValidationErrors(apiError.validationErrors);
      }
      setError(apiError.message || 'Failed to create class. Please try again.');
    } finally {
      setIsLoading(false);
      setIsSavingDraft(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/educator"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Create New Class</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            Set up your live or video class
          </p>
        </div>

        {/* Class Type Selection */}
        <div className="card-premium p-6 mb-8">
          <h2 className="text-lg font-light text-[var(--charcoal)] mb-4">Class Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setClassType('live')}
              className={`p-6 rounded border-2 transition-all ${
                classType === 'live'
                  ? 'border-[var(--champagne)] bg-[var(--champagne)]/5'
                  : 'border-[var(--border)] hover:border-[var(--champagne)]/50'
              }`}
            >
              <Radio
                className={`w-8 h-8 mb-3 ${
                  classType === 'live' ? 'text-[var(--champagne)]' : 'text-[var(--text-muted)]'
                }`}
              />
              <h3 className="text-lg font-light text-[var(--charcoal)]">Live Class</h3>
              <p className="text-sm font-light text-[var(--text-muted)] mt-1">
                Real-time interactive session with students
              </p>
            </button>

            <button
              type="button"
              onClick={() => setClassType('video')}
              className={`p-6 rounded border-2 transition-all ${
                classType === 'video'
                  ? 'border-[var(--champagne)] bg-[var(--champagne)]/5'
                  : 'border-[var(--border)] hover:border-[var(--champagne)]/50'
              }`}
            >
              <Video
                className={`w-8 h-8 mb-3 ${
                  classType === 'video' ? 'text-[var(--champagne)]' : 'text-[var(--text-muted)]'
                }`}
              />
              <h3 className="text-lg font-light text-[var(--charcoal)]">Video Course</h3>
              <p className="text-sm font-light text-[var(--text-muted)] mt-1">
                Pre-recorded video for on-demand access
              </p>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
              {Object.keys(validationErrors).length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="card-premium p-6 mb-6">
            <h2 className="text-lg font-light text-[var(--charcoal)] mb-6">Basic Information</h2>
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Class Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`input-premium ${validationErrors.title ? 'border-red-300' : ''}`}
                  placeholder="e.g., Advanced Lip Filler Techniques"
                  required
                  minLength={5}
                  maxLength={255}
                />
                {validationErrors.title && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`input-premium min-h-[120px] resize-none ${validationErrors.description ? 'border-red-300' : ''}`}
                  placeholder="Describe what students will learn in this class (min 50 characters)..."
                  required
                  minLength={50}
                  maxLength={5000}
                />
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  {formData.description.length}/5000 characters (minimum 50)
                </p>
                {validationErrors.description && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.description}</p>
                )}
              </div>

              {/* Category and Skill Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`input-premium ${validationErrors.categoryId ? 'border-red-300' : ''}`}
                    required
                    disabled={isLoadingCategories}
                  >
                    <option value="">{isLoadingCategories ? 'Loading...' : 'Select category'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.categoryId && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Skill Level
                  </label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as SkillLevel })}
                    className="input-premium"
                  >
                    <option value="ALL_LEVELS">All Levels</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Topics (what students will learn)
                </label>
                <input
                  type="text"
                  value={formData.topics}
                  onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                  className="input-premium"
                  placeholder="e.g., Injection techniques, Patient assessment, Safety protocols"
                />
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  Separate topics with commas (max 10)
                </p>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Requirements (prerequisites)
                </label>
                <input
                  type="text"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="input-premium"
                  placeholder="e.g., Basic anatomy knowledge, Medical license"
                />
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  Separate requirements with commas (max 10)
                </p>
              </div>
            </div>
          </div>

          {/* Scheduling (Live classes only) */}
          {classType === 'live' && (
            <div className="card-premium p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-light text-[var(--charcoal)]">Schedule</h2>
                <span className="text-xs font-light text-[var(--text-muted)]">
                  * Required for publishing (optional for drafts)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-premium"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Video Upload (Video courses only) */}
          {classType === 'video' && (
            <div className="card-premium p-6 mb-6">
              <h2 className="text-lg font-light text-[var(--charcoal)] mb-6">Video Upload</h2>
              <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-10 text-center">
                <Upload className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)] font-light mb-2">
                  Drag and drop your video here, or click to browse
                </p>
                <p className="text-sm font-light text-[var(--text-muted)]">
                  Supported formats: MP4, MOV, WebM (Max 2GB)
                </p>
                <input type="file" accept="video/*" className="hidden" />
                <button type="button" className="btn-secondary mt-4">
                  Choose File
                </button>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="card-premium p-6 mb-6">
            <h2 className="text-lg font-light text-[var(--charcoal)] mb-6">Pricing & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-premium"
                  placeholder="0.00"
                  required
                />
              </div>

              {classType === 'live' && (
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Max Students (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                    className="input-premium"
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/educator" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              {isLoading && isSavingDraft ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading && !isSavingDraft ? 'Scheduling...' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
