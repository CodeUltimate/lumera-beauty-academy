'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  const t = useTranslations('common');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const buttonClasses = (isSelected: boolean) =>
    cn(
      'flex-shrink-0 px-4 sm:px-5 min-h-[40px] sm:min-h-[44px] text-xs font-medium tracking-widest uppercase rounded-sm transition-all whitespace-nowrap touch-action-manipulation',
      isSelected
        ? 'bg-[var(--champagne)] text-white'
        : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--champagne)] hover:text-[var(--champagne)] active:bg-[var(--cream)]'
    );

  return (
    <div className="relative">
      {/* Left scroll arrow - desktop only */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 border border-[var(--border-light)] rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <button
          onClick={() => onSelect(null)}
          className={buttonClasses(selectedCategory === null)}
          style={{ scrollSnapAlign: 'start' }}
        >
          {t('all')}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={buttonClasses(selectedCategory === category.id)}
            style={{ scrollSnapAlign: 'start' }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Right scroll arrow - desktop only */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-white/90 border border-[var(--border-light)] rounded-full shadow-sm hover:bg-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
