const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  imageUrl: string | null;
  visible: boolean;
  displayOrder: number;
}

export interface EducatorSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
  specialty: string | null;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export type LiveClassStatus = 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  maxStudents: number | null;
  scheduledAt: string;
  startedAt: string | null;
  endedAt: string | null;
  status: LiveClassStatus;
  skillLevel: SkillLevel;
  thumbnailUrl: string | null;
  recordingUrl: string | null;
  meetingUrl: string | null;
  topics: string[];
  requirements: string[];
  educator: EducatorSummary;
  category: CategorySummary;
  enrollmentCount: number;
  hasAvailableSpots: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLiveClassRequest {
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  maxStudents?: number | null;
  scheduledAt?: string | null; // ISO 8601 format - optional for drafts
  categoryId: string;
  skillLevel?: SkillLevel;
  thumbnailUrl?: string | null;
  topics?: string[];
  requirements?: string[];
  draft?: boolean; // If true, saves as draft without requiring scheduledAt
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  validationErrors?: Record<string, string>;
}

export interface LiveClassFilters {
  filter?: string; // upcoming, past, draft, all
  categoryId?: string;
  skillLevel?: SkillLevel;
  startDate?: string; // ISO 8601 format
  endDate?: string; // ISO 8601 format
  search?: string;
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  enrolledClasses: number;
  completedClasses: number;
  firstEnrolledAt: string | null;
}

class ClassesApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        status: response.status,
        error: 'Error',
        message: 'An unexpected error occurred',
      }));
      throw error;
    }

    return response.json();
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/v1/categories');
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/v1/categories/${slug}`);
  }

  // Live Classes
  async getUpcomingClasses(page = 0, size = 12): Promise<PageResponse<LiveClass>> {
    return this.request<PageResponse<LiveClass>>(`/v1/classes?page=${page}&size=${size}`);
  }

  async getLiveNow(): Promise<LiveClass[]> {
    return this.request<LiveClass[]>('/v1/classes/live');
  }

  async getClassesByCategory(slug: string, page = 0, size = 12): Promise<PageResponse<LiveClass>> {
    return this.request<PageResponse<LiveClass>>(`/v1/classes/category/${slug}?page=${page}&size=${size}`);
  }

  async getClassesByEducator(educatorId: string, page = 0, size = 12): Promise<PageResponse<LiveClass>> {
    return this.request<PageResponse<LiveClass>>(`/v1/classes/educator/${educatorId}?page=${page}&size=${size}`);
  }

  async getClassById(id: string): Promise<LiveClass> {
    return this.request<LiveClass>(`/v1/classes/${id}`);
  }

  async searchClasses(query: string, page = 0, size = 12): Promise<PageResponse<LiveClass>> {
    return this.request<PageResponse<LiveClass>>(`/v1/classes/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  }

  // ===== Educator endpoints (require EDUCATOR role) =====
  // These use /v1/educator/classes path

  // Get my classes as educator with optional filters
  async getMyClasses(filters: LiveClassFilters = {}, page = 0, size = 12): Promise<PageResponse<LiveClass>> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());

    if (filters.filter) params.set('filter', filters.filter);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.skillLevel) params.set('skillLevel', filters.skillLevel);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.search) params.set('search', filters.search);

    return this.request<PageResponse<LiveClass>>(`/v1/educator/classes?${params.toString()}`);
  }

  async getMyClassById(id: string): Promise<LiveClass> {
    return this.request<LiveClass>(`/v1/educator/classes/${id}`);
  }

  async createClass(data: CreateLiveClassRequest): Promise<LiveClass> {
    return this.request<LiveClass>('/v1/educator/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(id: string, data: Partial<CreateLiveClassRequest>): Promise<LiveClass> {
    return this.request<LiveClass>(`/v1/educator/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelClass(id: string): Promise<void> {
    await this.request<void>(`/v1/educator/classes/${id}`, {
      method: 'DELETE',
    });
  }

  async startClass(id: string, meetingUrl: string): Promise<LiveClass> {
    return this.request<LiveClass>(`/v1/educator/classes/${id}/start?meetingUrl=${encodeURIComponent(meetingUrl)}`, {
      method: 'POST',
    });
  }

  async endClass(id: string, recordingUrl?: string): Promise<LiveClass> {
    const url = recordingUrl
      ? `/v1/educator/classes/${id}/end?recordingUrl=${encodeURIComponent(recordingUrl)}`
      : `/v1/educator/classes/${id}/end`;
    return this.request<LiveClass>(url, {
      method: 'POST',
    });
  }

  // ===== Student endpoints (require EDUCATOR role) =====

  async getMyStudents(search?: string, page = 0, size = 20): Promise<PageResponse<StudentSummary>> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    if (search) params.set('search', search);

    return this.request<PageResponse<StudentSummary>>(`/v1/educator/students?${params.toString()}`);
  }

  async getStudentCount(): Promise<number> {
    return this.request<number>('/v1/educator/students/count');
  }

  // ===== Earnings endpoints (require EDUCATOR role) =====

  async downloadEarningsReportPdf(): Promise<Blob> {
    const response = await fetch(`${API_URL}/v1/educator/earnings/report/pdf`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return response.blob();
  }

  // ===== Stats endpoints (require EDUCATOR role) =====

  async getEducatorStats(): Promise<EducatorDashboardStats> {
    return this.request<EducatorDashboardStats>('/v1/educator/stats/overview');
  }

  async getCertificateStats(): Promise<CertificateStats> {
    return this.request<CertificateStats>('/v1/educator/stats/certificates');
  }

  // ===== Admin Category endpoints (require ADMIN role) =====

  async getAllCategories(): Promise<Category[]> {
    return this.request<Category[]>('/v1/categories/all');
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return this.request<Category>('/v1/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    return this.request<Category>(`/v1/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleCategoryVisibility(id: string): Promise<void> {
    await this.request<void>(`/v1/categories/${id}/toggle-visibility`, {
      method: 'PATCH',
    });
  }
}

// Stats types
export interface EducatorDashboardStats {
  certificatesIssued: number;
  classCompletions: number;
}

export interface CertificateStats {
  certificatesIssued: number;
  classCompletions: number;
}

// Admin Category types
export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  visible?: boolean;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  visible?: boolean;
  displayOrder?: number;
}

export const classesApi = new ClassesApi();
