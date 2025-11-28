import { Star } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface TestimonialCardProps {
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
}

export default function TestimonialCard({
  name,
  role,
  location,
  content,
  rating,
}: TestimonialCardProps) {
  return (
    <div className="card-premium p-8">
      {/* Rating */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-[var(--champagne)] fill-[var(--champagne)]'
                : 'text-[var(--border)]'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-6">
        &ldquo;{content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center">
          <span className="text-sm font-light text-[var(--charcoal)]">
            {getInitials(name)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--charcoal)]">{name}</p>
          <p className="text-xs font-light text-[var(--text-muted)]">
            {role} • {location}
          </p>
        </div>
      </div>
    </div>
  );
}
