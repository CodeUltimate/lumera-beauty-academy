import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-4">
              Privacy Policy
            </h1>
            <p className="text-[var(--text-muted)] font-light">
              Last updated: November 2024
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Introduction</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                Luméra Beauty Academy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our platform.
              </p>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                Please read this privacy policy carefully. By using our services, you consent to the
                practices described in this policy.
              </p>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Information We Collect</h2>

              <h3 className="text-lg font-light text-[var(--charcoal)] mb-3 mt-6">Personal Information</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide when you:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
                <li>Create an account</li>
                <li>Purchase a class</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our support team</li>
                <li>Apply to become an educator</li>
              </ul>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                This information may include your name, email address, phone number, billing information,
                and professional credentials.
              </p>

              <h3 className="text-lg font-light text-[var(--charcoal)] mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                When you access our platform, we automatically collect certain information including
                your IP address, browser type, device information, and usage data to improve our services.
              </p>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">How We Use Your Information</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Issue certificates upon course completion</li>
              </ul>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Information Sharing</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2">
                <li><strong>With Educators:</strong> When you enroll in a class, relevant information is shared with the educator</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
              </ul>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Data Security</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction. However,
                no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Your Rights</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Cookies</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our platform and
                store certain information. You can instruct your browser to refuse all cookies or
                indicate when a cookie is being sent.
              </p>
            </div>

            <div className="card-premium p-8 mb-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Children&apos;s Privacy</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed">
                Our services are not intended for individuals under the age of 18. We do not knowingly
                collect personal information from children under 18.
              </p>
            </div>

            <div className="card-premium p-8">
              <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Contact Us</h2>
              <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-[var(--text-secondary)] font-light">
                Email: privacy@lumera.academy<br />
                Luméra Beauty Academy<br />
                London, United Kingdom
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
