'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
  Radio,
  Video,
  AlertCircle,
  Loader2,
  CheckCircle,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { classesApi, Category, SkillLevel, ApiError, LiveClass } from '@/lib/api';

type ClassType = 'live' | 'video';

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;

  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingClass, setIsLoadingClass] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [classType, setClassType] = useState<ClassType>('live');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Fetch class data
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const data = await classesApi.getMyClassById(classId);
        setLiveClass(data);

        // Check if class can be edited
        if (data.status === 'LIVE' || data.status === 'COMPLETED') {
          setError('This class cannot be edited because it is live or completed.');
          return;
        }

        // Parse scheduledAt into date and time
        let date = '';
        let time = '';
        if (data.scheduledAt) {
          const scheduledDate = new Date(data.scheduledAt);
          date = scheduledDate.toISOString().split('T')[0];
          time = scheduledDate.toTimeString().slice(0, 5);
        }

        // Populate form with existing data
        setFormData({
          title: data.title,
          description: data.description,
          categoryId: data.category.id,
          skillLevel: data.skillLevel,
          topics: data.topics?.join(', ') || '',
          requirements: data.requirements?.join(', ') || '',
          price: data.price.toString(),
          date,
          time,
          duration: data.durationMinutes.toString(),
          maxStudents: data.maxStudents?.toString() || '',
        });
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to load class');
      } finally {
        setIsLoadingClass(false);
      }
    };
    fetchClass();
  }, [classId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await classesApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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
    setSuccessMessage(null);
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

      await classesApi.updateClass(classId, {
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

      // Show success message and redirect
      if (saveAsDraft) {
        setSuccessMessage('Draft saved successfully');
        setTimeout(() => {
          router.push('/educator/classes?tab=draft');
        }, 1000);
      } else {
        setSuccessMessage('Class updated and scheduled successfully');
        setTimeout(() => {
          router.push('/educator/classes');
        }, 1000);
      }
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.validationErrors) {
        setValidationErrors(apiError.validationErrors);
      }
      setError(apiError.message || 'Failed to update class. Please try again.');
    } finally {
      setIsLoading(false);
      setIsSavingDraft(false);
    }
  };

  // Loading state
  if (isLoadingClass) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--champagne)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)] font-light">Loading class...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state for non-editable classes
  if (!liveClass || (liveClass.status !== 'DRAFT' && liveClass.status !== 'SCHEDULED')) {
    return (
      <DashboardLayout>
        <div className="p-6 lg:p-8 max-w-4xl">
          <Link
            href="/educator/classes"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Classes</span>
          </Link>
          <div className="card-premium p-8 text-center">
            <AlertCircle className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <h2 className="text-xl font-light text-[var(--charcoal)] mb-2">Cannot Edit Class</h2>
            <p className="text-[var(--text-muted)] font-light mb-6">
              {error || 'This class cannot be edited. Only draft and scheduled classes can be modified.'}
            </p>
            <Link href="/educator/classes" className="btn-primary">
              Back to Classes
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isDraft = liveClass.status === 'DRAFT';

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/educator/classes"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Classes</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Edit Class</h1>
              <p className="text-[var(--text-secondary)] font-light mt-1">
                Update your {isDraft ? 'draft' : 'scheduled'} class details
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-light rounded ${
                isDraft
                  ? 'bg-[var(--cream)] text-[var(--text-muted)]'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {isDraft ? 'Draft' : 'Scheduled'}
            </span>
          </div>
        </div>

        {/* Class Type Selection (Read-only for now) */}
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

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
          <div className="flex items-center justify-between">
            <Link
              href="/educator/classes"
              className="text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] transition-colors"
            >
              Cancel
            </Link>
            <div className="flex items-center space-x-4">
              {isDraft && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isLoading}
                  className="btn-secondary disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading && isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {isLoading && !isSavingDraft
                    ? 'Updating...'
                    : isDraft
                    ? 'Publish Class'
                    : 'Update Class'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
