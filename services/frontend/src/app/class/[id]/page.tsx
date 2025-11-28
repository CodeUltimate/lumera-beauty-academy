'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle,
  Award,
  Share2,
  Heart,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { mockLiveClasses } from '@/data/mockData';
import {
  formatPrice,
  formatDate,
  formatTime,
  formatDuration,
  getTimeUntil,
  getInitials,
} from '@/lib/utils';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;

  const liveClass = mockLiveClasses.find((c) => c.id === classId);

  if (!liveClass) {
    return (
      <main className="min-h-screen bg-[var(--cream-light)]">
        <Header />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-extralight text-[var(--charcoal)] mb-4">
              Class Not Found
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

  const spotsLeft = liveClass.maxStudents
    ? liveClass.maxStudents - liveClass.enrolledStudents
    : null;

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
            <span>Back to Classes</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)]">
                    {liveClass.category.name}
                  </span>
                  <span className="text-xs font-light text-[var(--text-muted)]">
                    {liveClass.subcategory}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extralight text-[var(--charcoal)] leading-tight mb-4">
                  {liveClass.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {liveClass.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--cream)] text-[var(--text-secondary)] text-xs font-light rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm font-light text-[var(--text-secondary)]">
                  <span className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[var(--champagne)]" />
                    <span>{formatDate(liveClass.scheduledAt)}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[var(--champagne)]" />
                    <span>
                      {formatTime(liveClass.scheduledAt)} • {formatDuration(liveClass.duration)}
                    </span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[var(--champagne)]" />
                    <span>{liveClass.enrolledStudents} enrolled</span>
                  </span>
                </div>
              </div>

              {/* Thumbnail Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[var(--plum)] to-[var(--plum-light)] rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-3xl font-light">
                      {getInitials(liveClass.educator.name)}
                    </span>
                  </div>
                  <p className="text-lg font-light">{liveClass.educator.name}</p>
                  <p className="text-sm font-light opacity-70">{liveClass.type === 'live' ? 'Live Class' : 'Video Course'}</p>
                </div>
              </div>

              {/* Description */}
              <div className="card-premium p-6">
                <h2 className="text-xl font-light text-[var(--charcoal)] mb-4">About This Class</h2>
                <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                  {liveClass.description}
                </p>
              </div>

              {/* What You will Learn */}
              <div className="card-premium p-6">
                <h2 className="text-xl font-light text-[var(--charcoal)] mb-4">
                  What You Will Learn
                </h2>
                <ul className="space-y-3">
                  {[
                    'Master advanced techniques from industry experts',
                    'Real-time Q&A and personalized feedback',
                    'Hands-on demonstrations and practice sessions',
                    'Access to exclusive resources and materials',
                    'Certificate of completion upon finishing',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-[var(--champagne)] flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--text-secondary)] font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Educator */}
              <div className="card-premium p-6">
                <h2 className="text-xl font-light text-[var(--charcoal)] mb-4">Your Educator</h2>
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--beige)] to-[var(--cream)] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-light text-[var(--charcoal)]">
                      {getInitials(liveClass.educator.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-light text-[var(--charcoal)]">
                        {liveClass.educator.name}
                      </h3>
                      {liveClass.educator.verified && (
                        <CheckCircle className="w-4 h-4 text-[var(--champagne)]" />
                      )}
                    </div>
                    <p className="text-sm font-light text-[var(--text-muted)] mb-2">
                      {liveClass.educator.specialty.join(' • ')}
                    </p>
                    <div className="flex items-center space-x-4 text-sm font-light text-[var(--text-secondary)] mb-3">
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-[var(--champagne)] fill-[var(--champagne)]" />
                        <span>{liveClass.educator.rating}</span>
                      </span>
                      <span>{liveClass.educator.totalStudents.toLocaleString()} students</span>
                      <span>{liveClass.educator.totalClasses} classes</span>
                    </div>
                    <p className="text-sm font-light text-[var(--text-secondary)]">
                      {liveClass.educator.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card-premium p-6 sticky top-24">
                {/* Price */}
                <div className="text-center mb-6">
                  <p className="text-4xl font-extralight text-[var(--charcoal)]">
                    {formatPrice(liveClass.price, liveClass.currency)}
                  </p>
                  <p className="text-sm font-light text-[var(--text-muted)] mt-1">
                    One-time payment
                  </p>
                </div>

                {/* Countdown / Status */}
                <div className="bg-[var(--cream)] rounded p-4 text-center mb-6">
                  <p className="text-sm font-light text-[var(--text-muted)]">Class starts in</p>
                  <p className="text-2xl font-light text-[var(--charcoal)] mt-1">
                    {getTimeUntil(liveClass.scheduledAt)}
                  </p>
                  <p className="text-sm font-light text-[var(--champagne)] mt-1">
                    {formatDate(liveClass.scheduledAt)} at {formatTime(liveClass.scheduledAt)}
                  </p>
                </div>

                {/* Spots Left */}
                {spotsLeft !== null && (
                  <div className="text-center mb-6">
                    <p className="text-sm font-light text-[var(--text-secondary)]">
                      <span className="text-[var(--champagne)] font-medium">{spotsLeft}</span> spots
                      remaining
                    </p>
                    <div className="w-full h-1.5 bg-[var(--cream)] rounded-full mt-2">
                      <div
                        className="h-full bg-[var(--champagne)] rounded-full"
                        style={{
                          width: `${(liveClass.enrolledStudents / liveClass.maxStudents!) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button className="btn-primary w-full mb-3">Enroll Now</button>

                {/* Secondary Actions */}
                <div className="flex space-x-3">
                  <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* What is Included */}
                <div className="mt-6 pt-6 border-t border-[var(--border-light)]">
                  <h4 className="text-sm font-medium text-[var(--charcoal)] mb-4">
                    What is Included
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3 text-sm font-light text-[var(--text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--champagne)]" />
                      <span>Live interactive session</span>
                    </li>
                    <li className="flex items-center space-x-3 text-sm font-light text-[var(--text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--champagne)]" />
                      <span>Real-time Q&A</span>
                    </li>
                    <li className="flex items-center space-x-3 text-sm font-light text-[var(--text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--champagne)]" />
                      <span>Recording access for 30 days</span>
                    </li>
                    <li className="flex items-center space-x-3 text-sm font-light text-[var(--text-secondary)]">
                      <Award className="w-4 h-4 text-[var(--champagne)]" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
