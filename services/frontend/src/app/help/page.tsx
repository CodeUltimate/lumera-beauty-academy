'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, BookOpen, CreditCard, Video, Award, User, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const faqCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: BookOpen,
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Get Started" button on the homepage and follow the registration process. You can sign up as a student to learn or as an educator to teach.',
      },
      {
        question: 'What equipment do I need for live classes?',
        answer: 'You need a stable internet connection, a computer or tablet with a camera and microphone, and a quiet space to focus on learning.',
      },
      {
        question: 'Can I access classes on mobile devices?',
        answer: 'Yes, our platform is fully responsive and works on smartphones and tablets. However, for the best live class experience, we recommend using a computer.',
      },
    ],
  },
  {
    id: 'payments',
    name: 'Payments & Pricing',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers in select countries.',
      },
      {
        question: 'Can I get a refund if I miss a live class?',
        answer: 'If you miss a live class, you will have access to the recording for 30 days. Refunds are available up to 24 hours before the scheduled class time.',
      },
      {
        question: 'Are there any subscription options?',
        answer: 'Currently, all classes are purchased individually. We are working on subscription options for 2025.',
      },
    ],
  },
  {
    id: 'live-classes',
    name: 'Live Classes',
    icon: Video,
    faqs: [
      {
        question: 'How do I join a live class?',
        answer: 'Once enrolled, go to your dashboard and click "Join Now" when the class is about to start. You will be taken directly to the virtual classroom.',
      },
      {
        question: 'Can I ask questions during the class?',
        answer: 'Absolutely! Use the chat feature to ask questions in real-time. Educators monitor the chat and address questions throughout the session.',
      },
      {
        question: 'What happens if there are technical issues?',
        answer: 'If you experience technical difficulties, try refreshing your browser. If issues persist, contact support and we will provide access to the class recording.',
      },
    ],
  },
  {
    id: 'certificates',
    name: 'Certificates',
    icon: Award,
    faqs: [
      {
        question: 'How do I get a certificate?',
        answer: 'Certificates are automatically issued upon completing a class. You can download them from your dashboard under the Certificates section.',
      },
      {
        question: 'Are certificates recognized in the industry?',
        answer: 'Our certificates are issued by verified industry experts and include unique verification codes. Many employers and clients recognize Luméra certifications.',
      },
      {
        question: 'Can I verify a certificate?',
        answer: 'Yes, each certificate has a unique ID that can be verified on our website to confirm authenticity.',
      },
    ],
  },
  {
    id: 'account',
    name: 'Account & Settings',
    icon: User,
    faqs: [
      {
        question: 'How do I update my profile?',
        answer: 'Go to Settings in your dashboard to update your profile information, including your name, email, and profile picture.',
      },
      {
        question: 'How do I change my password?',
        answer: 'In Settings, click on "Security" and then "Change Password." You will need to enter your current password to set a new one.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion in Settings. Please note that this action is permanent and you will lose access to purchased classes.',
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) =>
    selectedCategory ? category.id === selectedCategory : category.faqs.length > 0 || !searchQuery
  );

  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white to-[var(--cream)]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-6">
            How can we help?
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="input-premium pl-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 px-6 border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm transition-all ${
                selectedCategory === null
                  ? 'bg-[var(--champagne)] text-white'
                  : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--champagne)]'
              }`}
            >
              All Topics
            </button>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 text-xs font-medium tracking-widest uppercase rounded-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[var(--champagne)] text-white'
                    : 'bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--champagne)]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.map((category) => (
            <div key={category.id} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <category.icon className="w-6 h-6 text-[var(--champagne)]" />
                <h2 className="text-2xl font-light text-[var(--charcoal)]">{category.name}</h2>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq, index) => {
                  const faqId = `${category.id}-${index}`;
                  const isExpanded = expandedFaq === faqId;

                  return (
                    <div key={index} className="card-premium overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                        className="w-full p-5 flex items-center justify-between text-left"
                      >
                        <span className="font-light text-[var(--charcoal)] pr-4">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[var(--champagne)] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5">
                          <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCategories.every((c) => c.faqs.length === 0) && searchQuery && (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)] font-light">
                No results found for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-[var(--cream)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">
            Still need help?
          </h2>
          <p className="text-[var(--text-secondary)] font-light mb-8">
            Our support team is here to assist you with any questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
