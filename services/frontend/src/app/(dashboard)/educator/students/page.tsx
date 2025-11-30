'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search, Mail, Award, MoreVertical, Loader2, AlertCircle, Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { classesApi, StudentSummary, ApiError } from '@/lib/api';
import { getInitials, formatDate } from '@/lib/utils';

export default function EducatorStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await classesApi.getMyStudents(debouncedSearch || undefined);
      setStudents(response.content);
      setTotalStudents(response.totalElements);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/educator"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">My Students</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            {totalStudents} {totalStudents === 1 ? 'student has' : 'students have'} enrolled in your classes
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name or email..."
              className="input-premium w-full"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
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
        ) : students.length > 0 ? (
          /* Students Table */
          <div className="card-premium overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)]">
                    <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                      Student
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                      Enrolled
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                      Completed
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                      First Enrolled
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-medium tracking-widest uppercase text-[var(--text-muted)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--cream-light)]">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {student.avatarUrl ? (
                            <Image
                              src={student.avatarUrl}
                              alt={student.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
                              <span className="text-sm font-light text-[var(--charcoal)]">
                                {getInitials(student.name)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[var(--charcoal)]">{student.name}</p>
                            <p className="text-xs font-light text-[var(--text-muted)]">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-light text-[var(--text-secondary)]">
                          {student.enrolledClasses} {student.enrolledClasses === 1 ? 'class' : 'classes'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-light text-[var(--text-secondary)]">
                          {student.completedClasses} {student.completedClasses === 1 ? 'class' : 'classes'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-light text-[var(--text-secondary)]">
                          {student.firstEnrolledAt ? formatDate(student.firstEnrolledAt) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 hover:bg-[var(--cream)] rounded transition-colors" title="Send Email">
                            <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                          <button className="p-2 hover:bg-[var(--cream)] rounded transition-colors" title="Issue Certificate">
                            <Award className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === student.id ? null : student.id)}
                              className="p-2 hover:bg-[var(--cream)] rounded transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
                            </button>
                            {openMenu === student.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-[var(--border-light)] rounded shadow-lg py-1 z-10">
                                <button className="w-full px-4 py-2 text-left text-sm font-light text-[var(--text-secondary)] hover:bg-[var(--cream)]">
                                  View Profile
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm font-light text-[var(--text-secondary)] hover:bg-[var(--cream)]">
                                  View Enrollments
                                </button>
                                <button className="w-full px-4 py-2 text-left text-sm font-light text-[var(--text-secondary)] hover:bg-[var(--cream)]">
                                  Issue Certificate
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="card-premium p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--cream)] flex items-center justify-center">
              <Users className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-light text-[var(--charcoal)] mb-2">
              {debouncedSearch ? 'No students found' : 'No students yet'}
            </h3>
            <p className="text-[var(--text-muted)] font-light">
              {debouncedSearch
                ? 'No students match your search criteria'
                : 'When students enroll in your classes, they will appear here'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
