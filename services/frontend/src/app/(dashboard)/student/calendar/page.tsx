'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { mockLiveClasses } from '@/data/mockData';
import { formatTime } from '@/lib/utils';

export default function StudentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getClassesForDay = (day: number) => {
    return mockLiveClasses.filter((c) => {
      const classDate = new Date(c.scheduledAt);
      return (
        classDate.getFullYear() === year &&
        classDate.getMonth() === month &&
        classDate.getDate() === day
      );
    });
  };

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

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
          <h1 className="text-3xl font-extralight text-[var(--charcoal)]">Class Calendar</h1>
          <p className="text-[var(--text-secondary)] font-light mt-1">
            View your scheduled classes
          </p>
        </div>

        {/* Calendar */}
        <div className="card-premium p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-[var(--cream)] rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <h2 className="text-xl font-light text-[var(--charcoal)]">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-[var(--cream)] rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const classes = day ? getClassesForDay(day) : [];
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border border-[var(--border-light)] rounded ${
                    day ? 'bg-white' : 'bg-[var(--cream-light)]'
                  } ${isToday(day || 0) ? 'ring-2 ring-[var(--champagne)]' : ''}`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-light mb-1 ${
                          isToday(day)
                            ? 'text-[var(--champagne)] font-medium'
                            : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1">
                        {classes.slice(0, 2).map((c) => (
                          <Link
                            key={c.id}
                            href={`/class/${c.id}`}
                            className="block p-1.5 bg-[var(--champagne)]/10 rounded text-xs hover:bg-[var(--champagne)]/20 transition-colors"
                          >
                            <div className="font-medium text-[var(--champagne)] truncate">
                              {c.title.slice(0, 20)}...
                            </div>
                            <div className="flex items-center space-x-1 text-[var(--text-muted)]">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(c.scheduledAt)}</span>
                            </div>
                          </Link>
                        ))}
                        {classes.length > 2 && (
                          <div className="text-xs text-[var(--champagne)] font-medium">
                            +{classes.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming This Week */}
        <div className="mt-8">
          <h2 className="text-xl font-light text-[var(--charcoal)] mb-4">Upcoming This Week</h2>
          <div className="space-y-3">
            {mockLiveClasses.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/class/${c.id}`} className="card-premium p-4 block">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-[var(--charcoal)]">{c.title}</p>
                    <p className="text-xs font-light text-[var(--text-muted)]">
                      {c.educator.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light text-[var(--champagne)]">
                      {formatTime(c.scheduledAt)}
                    </p>
                    <p className="text-xs font-light text-[var(--text-muted)]">
                      {new Date(c.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
