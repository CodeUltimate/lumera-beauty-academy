'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EducatorCard from '@/components/ui/EducatorCard';
import { mockEducators } from '@/data/mockData';
import { getVisibleCategories } from '@/data/categories';

export default function EducatorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const categories = getVisibleCategories();

  const filteredEducators = mockEducators.filter((educator) => {
    const matchesSearch =
      educator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      educator.specialty.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialty = selectedSpecialty
      ? educator.specialty.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))
      : true;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-4">
              Our Educators
            </h1>
            <p className="text-lg font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
              Learn from world-class beauty professionals with years of industry experience
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search educators by name or specialty..."
                className="input-premium pl-12"
              />
            </div>

            {/* Specialty Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedSpecialty(null)}
                className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm transition-all ${
                  selectedSpecialty === null
                    ? 'bg-[var(--champagne)] text-white'
                    : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--champagne)] hover:text-[var(--champagne)]'
                }`}
              >
                All Specialties
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedSpecialty(category.name)}
                  className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm transition-all ${
                    selectedSpecialty === category.name
                      ? 'bg-[var(--champagne)] text-white'
                      : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--champagne)] hover:text-[var(--champagne)]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm font-light text-[var(--text-muted)] mb-6 text-center">
            Showing {filteredEducators.length} educators
          </p>

          {/* Educators Grid */}
          {filteredEducators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEducators.map((educator) => (
                <EducatorCard key={educator.id} educator={educator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg font-light text-[var(--text-muted)]">
                No educators found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSelectedSpecialty(null);
                  setSearchQuery('');
                }}
                className="btn-secondary mt-4"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Become an Educator CTA */}
          <div className="mt-20 text-center">
            <div className="card-premium p-10 max-w-2xl mx-auto">
              <h2 className="text-2xl font-extralight text-[var(--charcoal)] mb-4">
                Share Your Expertise
              </h2>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                Are you a beauty professional with knowledge to share? Join our community of
                educators and reach students worldwide.
              </p>
              <a href="/register" className="btn-primary">
                Become an Educator
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
