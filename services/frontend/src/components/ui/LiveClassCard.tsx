'use client';

import Link from 'next/link';
import { Calendar, Clock, Users, Radio } from 'lucide-react';
import { LiveClass } from '@/types';
import { formatPrice, formatDate, formatTime, formatDuration, getTimeUntil, getInitials } from '@/lib/utils';

interface LiveClassCardProps {
  liveClass: LiveClass;
  featured?: boolean;
}

export default function LiveClassCard({ liveClass, featured = false }: LiveClassCardProps) {
  const isLive = liveClass.status === 'live';
  const spotsLeft = liveClass.maxStudents
    ? liveClass.maxStudents - liveClass.enrolledStudents
    : null;

  return (
    <Link href={`/class/${liveClass.id}`} className="block">
      <div className={`card-premium group cursor-pointer ${featured ? 'p-4 sm:p-6' : 'p-4 sm:p-5'}`}>
        {/* Header with Category and Live Status */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[11px] sm:text-xs font-medium tracking-widest uppercase text-[var(--champagne)]">
            {liveClass.category.name}
          </span>
          {isLive && (
            <div className="flex items-center space-x-1.5 live-badge">
              <Radio className="w-3 h-3 text-red-500" />
              <span className="text-[11px] sm:text-xs font-medium text-red-500 uppercase tracking-wider">
                Live Now
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-light text-[var(--charcoal)] mb-2 sm:mb-3 group-hover:text-[var(--champagne)] transition-colors leading-tight ${featured ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>
          {liveClass.title}
        </h3>

        {/* Description */}
        <p className="text-sm font-light text-[var(--text-secondary)] mb-3 sm:mb-4 line-clamp-2">
          {liveClass.description}
        </p>

        {/* Educator */}
        <div className="flex items-center space-x-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-[var(--border-light)]">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--beige)] flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-light text-[var(--charcoal)]">
              {getInitials(liveClass.educator.name)}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--charcoal)] truncate">
              {liveClass.educator.name}
            </p>
            <p className="text-xs font-light text-[var(--text-muted)] truncate">
              {liveClass.educator.specialty[0]}
            </p>
          </div>
        </div>

        {/* Class Details - Stack on mobile, inline on larger screens */}
        <div className="space-y-2 mb-3 sm:mb-4">
          {/* Date and Time - wrap on mobile */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-light text-[var(--text-secondary)]">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-[var(--champagne)] flex-shrink-0" />
              <span>{formatDate(liveClass.scheduledAt)}</span>
            </div>
            <span className="text-[var(--text-muted)] hidden sm:inline">at</span>
            <span className="text-[var(--text-muted)] sm:hidden">•</span>
            <span>{formatTime(liveClass.scheduledAt)}</span>
          </div>
          {/* Duration and Spots */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 text-sm font-light text-[var(--text-secondary)]">
              <Clock className="w-4 h-4 text-[var(--champagne)] flex-shrink-0" />
              <span>{formatDuration(liveClass.duration)}</span>
            </div>
            {spotsLeft !== null && spotsLeft <= 10 && (
              <div className="flex items-center space-x-1 text-sm font-light text-[var(--champagne)]">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{spotsLeft} spots left</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[var(--border-light)] gap-3">
          <div className="flex-shrink-0">
            <span className="text-lg sm:text-xl font-light text-[var(--charcoal)]">
              {formatPrice(liveClass.price, liveClass.currency)}
            </span>
          </div>
          <div className="text-sm font-medium text-[var(--champagne)] group-hover:translate-x-1 transition-transform whitespace-nowrap">
            {isLive ? 'Join Now' : `Starts in ${getTimeUntil(liveClass.scheduledAt)}`} →
          </div>
        </div>
      </div>
    </Link>
  );
}
