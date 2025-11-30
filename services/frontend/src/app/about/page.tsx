'use client';

import Link from 'next/link';
import { Globe, Award, Users, Heart, Target, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  const t = useTranslations('about');

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
            {t('mainHeading')}
          </h1>
          <p className="text-xl font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
            {t('mainDescription')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
                {t('missionLabel')}
              </p>
              <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)] mb-6">
                {t('missionTitle')}
              </h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-6">
                {t('missionDesc1')}
              </p>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('missionDesc2')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="card-premium p-6 text-center">
                <p className="text-4xl font-extralight text-[var(--champagne)] mb-2">10K+</p>
                <p className="text-sm font-light text-[var(--text-muted)]">{t('studentsWorldwide')}</p>
              </div>
              <div className="card-premium p-6 text-center">
                <p className="text-4xl font-extralight text-[var(--champagne)] mb-2">500+</p>
                <p className="text-sm font-light text-[var(--text-muted)]">{t('expertEducators')}</p>
              </div>
              <div className="card-premium p-6 text-center">
                <p className="text-4xl font-extralight text-[var(--champagne)] mb-2">50+</p>
                <p className="text-sm font-light text-[var(--text-muted)]">{t('countries')}</p>
              </div>
              <div className="card-premium p-6 text-center">
                <p className="text-4xl font-extralight text-[var(--champagne)] mb-2">2K+</p>
                <p className="text-sm font-light text-[var(--text-muted)]">{t('liveClassesCount')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
              {t('valuesLabel')}
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              {t('valuesTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">{t('excellence')}</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('excellenceDesc')}
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                <Globe className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">{t('accessibility')}</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('accessibilityDesc')}
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white flex items-center justify-center">
                <Heart className="w-7 h-7 text-[var(--champagne)]" />
              </div>
              <h3 className="text-xl font-light text-[var(--charcoal)] mb-3">{t('community')}</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                {t('communityDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
              {t('storyLabel')}
            </p>
            <h2 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)]">
              {t('storyTitle')}
            </h2>
          </div>

          <div className="prose prose-lg mx-auto">
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-6">
              Luméra was born from a simple observation: the most talented beauty educators were
              limited by geography, while ambitious professionals around the world hungered for
              quality training they couldn&apos;t access locally.
            </p>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-6">
              Our founders, with decades of combined experience in the beauty and aesthetics
              industry, envisioned a platform that would dissolve these barriers. A space where
              a nurse in Dubai could learn Russian lip techniques from a master in London, or
              where a PMU artist in Brazil could perfect their craft with guidance from Seoul&apos;s
              finest microblading experts.
            </p>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Today, Luméra stands as that bridge—connecting passion with expertise, ambition
              with opportunity, and creating a global community united by the pursuit of
              excellence in beauty.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[var(--plum)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extralight text-white mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg font-light text-white/70 max-w-2xl mx-auto mb-10">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary">
              {t('startLearning')}
            </Link>
            <Link
              href="/become-educator"
              className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              {t('becomeEducator')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
