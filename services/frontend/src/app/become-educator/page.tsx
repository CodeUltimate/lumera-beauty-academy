'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, DollarSign, Globe, Users, Calendar, Award, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getVisibleCategories } from '@/data/categories';

export default function BecomeEducatorPage() {
  const t = useTranslations('becomeEducator');
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
            {t('sectionLabel')}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-[var(--charcoal)] leading-tight mb-6">
            {t('heroTitle')}
            <span className="block text-[var(--champagne)]">{t('heroTitleHighlight')}</span>
          </h1>
          <p className="text-xl font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              {t('whyTeach')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Globe className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">{t('globalReach')}</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('globalReachDesc')}
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">{t('earnMore')}</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('earnMoreDesc')}
              </p>
            </div>

            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--beige)] flex items-center justify-center">
                <Calendar className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">{t('flexibleSchedule')}</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('flexibleScheduleDesc')}
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
              {t('gettingStarted')}
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              {t('howItWorks')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: t('steps.apply'),
                description: t('steps.applyDesc'),
              },
              {
                step: '02',
                title: t('steps.getVerified'),
                description: t('steps.getVerifiedDesc'),
              },
              {
                step: '03',
                title: t('steps.createClasses'),
                description: t('steps.createClassesDesc'),
              },
              {
                step: '04',
                title: t('steps.startTeaching'),
                description: t('steps.startTeachingDesc'),
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
              {t('whatWeLookFor')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              t('requirements.experience'),
              t('requirements.portfolio'),
              t('requirements.communication'),
              t('requirements.passion'),
              t('requirements.certifications'),
              t('requirements.commitment'),
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
              {t('applyNow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              {t('startApplication')}
            </h2>
          </div>

          {isSubmitted ? (
            <div className="card-premium p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-light text-[var(--charcoal)] mb-4">
                {t('applicationSubmitted')}
              </h3>
              <p className="text-[var(--text-secondary)] font-light mb-6">
                {t('thankYouApplication')}
              </p>
              <Link href="/" className="btn-primary">
                {t('returnHome')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    {t('form.fullName')} *
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
                    {t('form.emailAddress')} *
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
                    {t('form.primarySpecialty')} *
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="input-premium"
                    required
                  >
                    <option value="">{t('form.selectSpecialty')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                    {t('form.yearsExperience')} *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="input-premium"
                    required
                  >
                    <option value="">{t('form.selectExperience')}</option>
                    <option value="3-5">{t('form.years35')}</option>
                    <option value="5-10">{t('form.years510')}</option>
                    <option value="10-15">{t('form.years1015')}</option>
                    <option value="15+">{t('form.years15plus')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                  {t('form.websiteUrl')}
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
                  {t('form.aboutYou')} *
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  className="input-premium min-h-[150px] resize-none"
                  placeholder={t('form.aboutPlaceholder')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting ? t('form.submitting') : t('form.submitApplication')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light text-[var(--charcoal)] mb-6">{t('haveQuestions')}</h2>
          <p className="text-[var(--text-secondary)] font-light mb-6">
            {t('checkHelpCenter')}
          </p>
          <Link href="/help" className="btn-secondary">
            {t('visitHelpCenter')}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
