'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Radio, Search } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockLiveClasses } from '@/data/mockData';
import { formatDate, formatTime, formatDuration, getTimeUntil } from '@/lib/utils';

type TabType = 'upcoming' | 'completed' | 'all';

export default function StudentClassesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const allClasses = mockLiveClasses;
  const upcomingClasses = allClasses.filter((c) => c.status === 'upcoming');
  const completedClasses = allClasses.filter((c) => c.status === 'completed');

  const displayClasses =
    activeTab === 'upcoming'
      ? upcomingClasses
      : activeTab === 'completed'
      ? completedClasses
      : allClasses;

  const filteredClasses = displayClasses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.educator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">My Classes</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            View and manage your enrolled classes
          </p>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex space-x-1 p-1 bg-[var(--cream)] rounded-sm">
            {(['upcoming', 'completed', 'all'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-light rounded-sm transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-white text-[var(--charcoal)] shadow-sm'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {tab} ({tab === 'upcoming' ? upcomingClasses.length : tab === 'completed' ? completedClasses.length : allClasses.length})
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classes..."
              className="input-premium pl-10 py-2 text-sm"
            />
          </div>
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((liveClass) => (
              <div key={liveClass.id} className="card-premium p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                      {liveClass.status === 'completed' && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-light text-[var(--charcoal)] mb-2">
                      {liveClass.title}
                    </h3>
                    <p className="text-sm font-light text-[var(--text-muted)]">
                      by {liveClass.educator.name}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-sm font-light text-[var(--text-secondary)]">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-[var(--champagne)]" />
                        <span>{formatDate(liveClass.scheduledAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[var(--champagne)]" />
                        <span>{formatTime(liveClass.scheduledAt)} • {formatDuration(liveClass.duration)}</span>
                      </div>
                    </div>

                    {(liveClass.status === 'upcoming' || liveClass.status === 'live') && (
                      <Link
                        href={`/classroom/${liveClass.id}`}
                        className="btn-primary text-center whitespace-nowrap"
                      >
                        {liveClass.status === 'live' ? 'Join Now' : `In ${getTimeUntil(liveClass.scheduledAt)}`}
                      </Link>
                    )}
                    {liveClass.status === 'completed' && (
                      <div className="flex space-x-2">
                        <Link href={`/class/${liveClass.id}`} className="btn-secondary text-center">
                          View Recording
                        </Link>
                        <Link href="/student/certificates" className="btn-secondary text-center">
                          Certificate
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 card-premium">
              <p className="text-[var(--text-muted)] font-light">
                {searchQuery ? 'No classes found matching your search' : 'No classes in this category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
