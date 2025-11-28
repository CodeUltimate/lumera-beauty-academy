'use client';

import Link from 'next/link';
import { Calendar, Clock, Radio, BookOpen, Award, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockLiveClasses } from '@/data/mockData';
import { formatDate, formatTime, formatDuration, getTimeUntil } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  // Demo data - in production, this would come from API/context
  const upcomingClasses = mockLiveClasses.slice(0, 3);
  const purchasedClasses = mockLiveClasses.slice(0, 2);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Welcome back, {user?.firstName || 'there'}</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            Here is what is happening with your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Enrolled Classes</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Completed</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">8</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-[var(--text-muted)]">Certificates</p>
                <p className="text-3xl font-extralight text-[var(--charcoal)] mt-1">5</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Award className="w-5 h-5 text-[var(--champagne)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Live Classes */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-[var(--charcoal)]">Upcoming Live Classes</h2>
            <Link
              href="/student/classes"
              className="text-sm font-light text-[var(--champagne)] hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingClasses.map((liveClass) => (
              <div key={liveClass.id} className="card-premium p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)]">
                        {liveClass.category.name}
                      </span>
                      {liveClass.status === 'live' && (
                        <div className="flex items-center space-x-1 live-badge">
                          <Radio className="w-3 h-3 text-red-500" />
                          <span className="text-xs font-medium text-red-500 uppercase">Live</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-light text-[var(--charcoal)] mb-2">
                      {liveClass.title}
                    </h3>
                    <p className="text-sm font-light text-[var(--text-muted)]">
                      by {liveClass.educator.name}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex items-center space-x-4 text-sm font-light text-[var(--text-secondary)]">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(liveClass.scheduledAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(liveClass.scheduledAt)}</span>
                      </span>
                    </div>
                    <Link
                      href={`/classroom/${liveClass.id}`}
                      className={`btn-primary text-center ${
                        liveClass.status === 'live' ? '' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {liveClass.status === 'live'
                        ? 'Join Now'
                        : `Starts in ${getTimeUntil(liveClass.scheduledAt)}`}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Purchased */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-[var(--charcoal)]">Recently Purchased</h2>
            <Link
              href="/student/classes"
              className="text-sm font-light text-[var(--champagne)] hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchasedClasses.map((liveClass) => (
              <div key={liveClass.id} className="card-premium p-5">
                <span className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)]">
                  {liveClass.category.name}
                </span>
                <h3 className="text-lg font-light text-[var(--charcoal)] mt-2 mb-2">
                  {liveClass.title}
                </h3>
                <p className="text-sm font-light text-[var(--text-muted)] mb-4">
                  by {liveClass.educator.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-light text-[var(--text-secondary)]">
                    {formatDuration(liveClass.duration)}
                  </span>
                  <Link
                    href={`/class/${liveClass.id}`}
                    className="text-sm font-medium text-[var(--champagne)] hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
