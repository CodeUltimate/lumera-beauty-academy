'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, DollarSign, Globe, Users, Calendar, Award, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getVisibleCategories } from '@/data/categories';

export default function BecomeEducatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    experience: '',
    website: '',
    about: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = getVisibleCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-[var(--cream)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
            Become an Educator
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-[var(--charcoal)] leading-tight mb-6">
            Share Your Expertise
            <span className="block text-[var(--champagne)]">With the World</span>
          </h1>
          <p className="text-xl font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
            Join our community of world-class beauty educators and reach students globally
            through live, interactive classes.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              Why Teach on Luméra?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Globe className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">Global Reach</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                Reach students in 50+ countries without leaving your studio. Build an
                international following and expand your brand globally.
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">Earn More</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                Set your own prices and keep up to 80% of your earnings. Our top educators
                earn $10,000+ monthly through live classes.
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Calendar className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">Flexible Schedule</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                Teach when it works for you. Schedule classes around your existing commitments
                and work-life balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
              Getting Started
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Apply',
                description: 'Submit your application with your credentials and expertise.',
              },
              {
                step: '02',
                title: 'Get Verified',
                description: 'Our team reviews your application and verifies your qualifications.',
              },
              {
                step: '03',
                title: 'Create Classes',
                description: 'Set up your live classes with your preferred schedule and pricing.',
              },
              {
                step: '04',
                title: 'Start Teaching',
                description: 'Go live and share your knowledge with students worldwide.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-extralight text-[var(--champagne)]/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-light text-[var(--charcoal)] mb-2">{item.title}</h3>
                <p className="text-sm font-light text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              What We Look For
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Minimum 3 years of professional experience',
              'Strong portfolio or track record',
              'Excellent communication skills',
              'Passion for teaching and mentoring',
              'Professional certifications in your field',
              'Commitment to student success',
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-[var(--champagne)]/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[var(--champagne)]" />
                </div>
                <span className="text-[var(--text-secondary)] font-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-6 bg-[var(--cream)]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
              Apply Now
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              Start Your Application
            </h2>
          </div>

          {isSubmitted ? (
            <div className="card-premium p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-light text-[var(--charcoal)] mb-4">
                Application Submitted!
              </h3>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                Thank you for your interest in becoming a Luméra educator. Our team will review
                your application and get back to you within 3-5 business days.
              </p>
              <Link href="/" className="btn-primary">
                Return Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-premium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-premium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Primary Specialty *
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="input-premium"
                    required
                  >
                    <option value="">Select specialty</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    Years of Experience *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="input-premium"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10-15">10-15 years</option>
                    <option value="15+">15+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Website or Portfolio URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-premium"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  Tell us about yourself *
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="input-premium min-h-[150px] resize-none"
                  placeholder="Share your background, achievements, and why you want to teach on Luméra..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light text-[var(--charcoal)] mb-6">Have Questions?</h2>
          <p className="text-[var(--text-secondary)] font-light mb-6">
            Check our Help Center or reach out to our educator support team.
          </p>
          <Link href="/help" className="btn-secondary">
            Visit Help Center
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
