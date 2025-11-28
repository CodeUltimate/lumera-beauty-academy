'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Award, Globe, Radio, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LiveClassCard from '@/components/ui/LiveClassCard';
import EducatorCard from '@/components/ui/EducatorCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { getVisibleCategories } from '@/data/categories';
import { mockLiveClasses, mockEducators, testimonials } from '@/data/mockData';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getVisibleCategories();

  const filteredClasses = selectedCategory
    ? mockLiveClasses.filter((c) => c.categoryId === selectedCategory)
    : mockLiveClasses;

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section - Responsive padding for header height */}
      <section className="pt-24 lg:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 bg-gradient-to-b from-white to-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Live Badge */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white rounded-full border border-[var(--border-light)] mb-6 sm:mb-8">
              <Radio className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 live-badge" />
              <span className="text-xs sm:text-sm font-light text-[var(--text-secondary)]">
                Live classes happening now
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-[var(--charcoal)] leading-tight mb-4 sm:mb-6">
              Live Beauty Education
              <span className="block text-[var(--champagne)]">From Top Global Educators</span>
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg md:text-xl font-light text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 sm:mb-10">
              Live. Learn. Elevate. Join real-time masterclasses with world-renowned beauty
              professionals and transform your skills.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/live-classes" className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Explore Live Classes</span>
              </Link>
              <Link href="/become-educator" className="btn-secondary w-full sm:w-auto">
                Become an Educator
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-16 mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-[var(--border-light)]">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extralight text-[var(--charcoal)]">10,000+</p>
                <p className="text-xs sm:text-sm font-light text-[var(--text-muted)] mt-1">Students Worldwide</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extralight text-[var(--charcoal)]">500+</p>
                <p className="text-xs sm:text-sm font-light text-[var(--text-muted)] mt-1">Expert Educators</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-extralight text-[var(--charcoal)]">50+</p>
                <p className="text-xs sm:text-sm font-light text-[var(--text-muted)] mt-1">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Live Classes Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-2">
                Live Sessions
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
                Upcoming Live Classes
              </h2>
            </div>
            <Link
              href="/live-classes"
              className="flex items-center space-x-1 text-sm font-medium text-[var(--champagne)] hover:underline"
            >
              <span>View All Classes</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter */}
          <div className="mb-8 sm:mb-10">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClasses.slice(0, 6).map((liveClass) => (
              <LiveClassCard key={liveClass.id} liveClass={liveClass} />
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <p className="text-[var(--text-muted)] font-light">
                No classes found in this category. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* Educator Showcase */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-2">
              Learn From The Best
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              Featured Educators
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light max-w-xl mx-auto mt-4">
              World-class professionals sharing their expertise through live, interactive sessions
            </p>
          </div>

          {/* Educators Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {mockEducators.map((educator) => (
              <EducatorCard key={educator.id} educator={educator} />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8 sm:mt-10">
            <Link href="/educators" className="btn-secondary">
              View All Educators
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-2">
              The Luméra Difference
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              Why Choose Us
            </h2>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="text-center p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Radio className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-lg sm:text-xl font-light text-[var(--charcoal)] mb-2 sm:mb-3">Live Interaction</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                Real-time Q&A with top educators. Ask questions, get instant feedback, and learn
                through genuine interaction.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-lg sm:text-xl font-light text-[var(--charcoal)] mb-2 sm:mb-3">Global Community</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                Connect with beauty professionals worldwide. Learn from diverse perspectives and
                build your international network.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-4 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-7 sm:h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-lg sm:text-xl font-light text-[var(--charcoal)] mb-2 sm:mb-3">
                Verified Certificates
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                Earn recognized certificates upon completion. Build credibility and showcase your
                expertise to clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-2">
              Success Stories
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              What Our Students Say
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--plum)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-white mb-4 sm:mb-6">
            Ready to Elevate Your Skills?
          </h2>
          <p className="text-base sm:text-lg font-light text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10">
            Join thousands of beauty professionals learning from the best. Your next breakthrough is
            just one live class away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary w-full sm:w-auto">
              Start Learning Today
            </Link>
            <Link
              href="/become-educator"
              className="text-sm font-light text-white/70 hover:text-white transition-colors py-2"
            >
              Or become an educator →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
