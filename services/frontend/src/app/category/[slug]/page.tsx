'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LiveClassCard from '@/components/ui/LiveClassCard';
import EducatorCard from '@/components/ui/EducatorCard';
import { getCategoryBySlug, getVisibleCategories } from '@/data/categories';
import { mockLiveClasses, mockEducators } from '@/data/mockData';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = getCategoryBySlug(slug);
  const allCategories = getVisibleCategories();

  if (!category) {
    return (
      <main className="min-h-screen bg-[var(--cream-light)]">
        <Header />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-extralight text-[var(--charcoal)] mb-4">
              Category Not Found
            </h1>
            <Link href="/live-classes" className="btn-primary">
              Browse All Classes
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const categoryClasses = mockLiveClasses.filter((c) => c.categoryId === category.id);
  const categoryEducators = mockEducators.filter((e) =>
    e.specialty.some((s) => s.toLowerCase().includes(category.name.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/live-classes"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </Link>

          {/* Category Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-2">
              Category
            </p>
            <h1 className="text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-4">
              {category.name}
            </h1>
            <p className="text-lg font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>

          {/* Other Categories */}
          <div className="mb-12 overflow-x-auto pb-2">
            <div className="flex space-x-3">
              {allCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm transition-all whitespace-nowrap ${
                    cat.id === category.id
                      ? 'bg-[var(--champagne)] text-white'
                      : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--champagne)] hover:text-[var(--champagne)]'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Classes in this Category */}
          <section className="mb-16">
            <h2 className="text-2xl font-extralight text-[var(--charcoal)] mb-6">
              Upcoming Classes
            </h2>
            {categoryClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryClasses.map((liveClass) => (
                  <LiveClassCard key={liveClass.id} liveClass={liveClass} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 card-premium">
                <p className="text-[var(--text-muted)] font-light">
                  No upcoming classes in this category. Check back soon!
                </p>
              </div>
            )}
          </section>

          {/* Educators in this Category */}
          {categoryEducators.length > 0 && (
            <section>
              <h2 className="text-2xl font-extralight text-[var(--charcoal)] mb-6">
                Expert Educators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryEducators.map((educator) => (
                  <EducatorCard key={educator.id} educator={educator} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
