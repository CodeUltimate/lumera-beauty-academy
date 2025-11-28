'use client';

import { useState } from 'react';
import { Mail, MapPin, Clock, Send, Check } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white to-[var(--cream)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
            Contact Us
          </p>
          <h1 className="text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-6">
            Get in Touch
          </h1>
          <p className="text-xl font-light text-[var(--text-secondary)] max-w-2xl mx-auto">
            Have a question or need assistance? We are here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-light text-[var(--charcoal)] mb-6">
                  Contact Information
                </h2>
                <p className="text-[var(--text-secondary)] font-light">
                  Reach out to us through any of the following channels.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[var(--champagne)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-1">Email</h3>
                    <p className="text-[var(--text-secondary)] font-light">support@lumera.academy</p>
                    <p className="text-[var(--text-secondary)] font-light">educators@lumera.academy</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--champagne)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-1">Headquarters</h3>
                    <p className="text-[var(--text-secondary)] font-light">
                      London, United Kingdom
                    </p>
                    <p className="text-[var(--text-muted)] text-sm font-light">
                      Global online platform
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--beige)] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--champagne)]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--charcoal)] mb-1">Support Hours</h3>
                    <p className="text-[var(--text-secondary)] font-light">
                      Monday - Friday: 9am - 6pm GMT
                    </p>
                    <p className="text-[var(--text-muted)] text-sm font-light">
                      Response within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-6 border-t border-[var(--border-light)]">
                <h3 className="text-sm font-medium text-[var(--charcoal)] mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/help" className="text-[var(--champagne)] font-light hover:underline">
                      Help Center & FAQs
                    </a>
                  </li>
                  <li>
                    <a href="/become-educator" className="text-[var(--champagne)] font-light hover:underline">
                      Become an Educator
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-[var(--champagne)] font-light hover:underline">
                      About Luméra
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="card-premium p-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-light text-[var(--charcoal)] mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-[var(--text-secondary)] font-light mb-6">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card-premium p-8 space-y-6">
                  <h2 className="text-2xl font-light text-[var(--charcoal)] mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-[var(--text-secondary)] font-light mb-6">
                    Fill out the form below and we will get back to you as soon as possible.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                        Your Name *
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

                  <div>
                    <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-premium"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="educator">Educator Application</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-[var(--text-secondary)] mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-premium min-h-[180px] resize-none"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
