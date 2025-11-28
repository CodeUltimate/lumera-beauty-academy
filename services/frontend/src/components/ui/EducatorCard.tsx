import Link from 'next/link';
import { Star, Users, BookOpen, CheckCircle } from 'lucide-react';
import { Educator } from '@/types';
import { getInitials } from '@/lib/utils';

interface EducatorCardProps {
  educator: Educator;
}

export default function EducatorCard({ educator }: EducatorCardProps) {
  return (
    <Link href={`/educator/${educator.id}`}>
      <div className="card-premium p-6 text-center group cursor-pointer">
        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
            <span className="text-2xl font-light text-[var(--charcoal)]">
              {getInitials(educator.name)}
            </span>
          </div>
          {educator.verified && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--champagne)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Name & Specialty */}
        <h3 className="text-lg font-light text-[var(--charcoal)] group-hover:text-[var(--champagne)] transition-colors">
          {educator.name}
        </h3>
        <p className="text-sm font-light text-[var(--text-muted)] mt-1">
          {educator.specialty.join(' • ')}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center space-x-1 mt-3">
          <Star className="w-4 h-4 text-[var(--champagne)] fill-[var(--champagne)]" />
          <span className="text-sm font-medium text-[var(--charcoal)]">{educator.rating}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-[var(--border-light)]">
          <div className="flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm font-light text-[var(--text-secondary)]">
              {educator.totalStudents.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm font-light text-[var(--text-secondary)]">
              {educator.totalClasses} classes
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
