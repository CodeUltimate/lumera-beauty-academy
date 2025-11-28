'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Users, BookOpen, ArrowRight, TrendingUp, Loader2, CalendarX, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { formatDate, formatTime, formatPrice } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { classesApi, LiveClass, EducatorDashboardStats } from '@/lib/api/classes';

export default function EducatorDashboard() {
  const { user } = useAuth();
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalClasses, setTotalClasses] = useState(0);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [stats, setStats] = useState<EducatorDashboardStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, studentCountResponse, statsResponse] = await Promise.all([
          classesApi.getMyClasses({ filter: 'upcoming' }, 0, 5),
          classesApi.getStudentCount().catch(() => null),
          classesApi.getEducatorStats().catch(() => null),
        ]);
        setUpcomingClasses(classesResponse.content);
        setTotalClasses(classesResponse.totalElements);
        setStudentCount(studentCountResponse);
        setStats(statsResponse);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extralight text-[var(--charcoal)]">
              Welcome back, {user?.firstName || 'there'}
            </h1>
            <p className="text-[var(--text-secondary)] font-light mt-1">
              Manage your classes and track your earnings
            </p>
          </div>
          <Link href="/educator/create" className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Class</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Total Students</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {isLoading ? '...' : (studentCount?.toLocaleString() ?? '0')}
                </p>
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  enrolled in your classes
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Upcoming Classes</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {isLoading ? '...' : totalClasses}
                </p>
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  {totalClasses === 1 ? 'class scheduled' : 'classes scheduled'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Certificates Issued</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {isLoading ? '...' : (stats?.certificatesIssued?.toLocaleString() ?? '0')}
                </p>
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  to your students
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Award className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Class Completions</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">
                  {isLoading ? '...' : (stats?.classCompletions?.toLocaleString() ?? '0')}
                </p>
                <p className="text-xs font-light text-[var(--text-muted)] mt-1">
                  students completed
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-[var(--charcoal)]">Your Upcoming Classes</h2>
            <Link
              href="/educator/classes"
              className="text-sm font-light text-[var(--champagne)] hover:underline flex items-center space-x-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="card-premium p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[var(--champagne)] animate-spin" />
            </div>
          ) : upcomingClasses.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <CalendarX className="w-8 h-8 text-[var(--champagne-dark)]" />
              </div>
              <h3 className="text-lg font-light text-[var(--charcoal)] mb-2">
                No upcoming classes
              </h3>
              <p className="text-sm font-light text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
                You don&apos;t have any scheduled classes yet. Create your first class and start sharing your expertise with students.
              </p>
              <Link href="/educator/create" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Your First Class</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingClasses.map((liveClass) => (
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
                      </div>
                      <h3 className="text-lg font-light text-[var(--charcoal)]">
                        {liveClass.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-sm font-light text-[var(--text-secondary)]">
                        <p>{formatDate(liveClass.scheduledAt)}</p>
                        <p className="text-[var(--text-muted)]">{formatTime(liveClass.scheduledAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-light text-[var(--charcoal)]">
                          {formatPrice(liveClass.price)}
                        </p>
                        <p className="text-xs font-light text-[var(--text-muted)]">per student</p>
                      </div>
                      <Link
                        href={`/educator/classes/${liveClass.id}/edit`}
                        className="btn-secondary"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {totalClasses > 5 && (
                <div className="text-center pt-2">
                  <Link
                    href="/educator/classes"
                    className="text-sm font-light text-[var(--champagne)] hover:underline"
                  >
                    View all {totalClasses} upcoming classes →
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-light text-[var(--charcoal)] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/educator/create" className="card-premium p-6 text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--champagne)]/10 flex items-center justify-center group-hover:bg-[var(--champagne)]/20 transition-colors">
                <Plus className="w-6 h-6 text-[var(--champagne)]" />
              </div>
              <h3 className="text-lg font-light text-[var(--charcoal)] mb-1">Create Live Class</h3>
              <p className="text-sm font-light text-[var(--text-muted)]">
                Schedule a new live session
              </p>
            </Link>

            <Link href="/educator/students" className="card-premium p-6 text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--champagne)]/10 flex items-center justify-center group-hover:bg-[var(--champagne)]/20 transition-colors">
                <Users className="w-6 h-6 text-[var(--champagne)]" />
              </div>
              <h3 className="text-lg font-light text-[var(--charcoal)] mb-1">View Students</h3>
              <p className="text-sm font-light text-[var(--text-muted)]">
                See all enrolled students
              </p>
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
