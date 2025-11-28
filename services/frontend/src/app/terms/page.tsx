import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--cream-light)]">
      <Header />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-medium tracking-widest uppercase text-[var(--champagne)] mb-4">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-extralight text-[var(--charcoal)] mb-4">
              Terms and Conditions
            </h1>
            <p className="text-[var(--text-muted)] font-light">
              Effective Date: November 1, 2024 | Last Updated: November 24, 2024
            </p>
          </div>

          {/* Table of Contents */}
          <div className="card-premium p-6 mb-8">
            <h2 className="text-lg font-medium text-[var(--charcoal)] mb-4">Table of Contents</h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { num: '1', title: 'Acceptance of Terms' },
                { num: '2', title: 'Definitions' },
                { num: '3', title: 'Account Registration' },
                { num: '4', title: 'Platform Services' },
                { num: '5', title: 'User Types and Responsibilities' },
                { num: '6', title: 'Payments and Fees' },
                { num: '7', title: 'Cancellation and Refund Policy' },
                { num: '8', title: 'Intellectual Property Rights' },
                { num: '9', title: 'User Content and Conduct' },
                { num: '10', title: 'Live Class Policies' },
                { num: '11', title: 'Certificates' },
                { num: '12', title: 'Privacy and Data Protection' },
                { num: '13', title: 'Disclaimers' },
                { num: '14', title: 'Limitation of Liability' },
                { num: '15', title: 'Indemnification' },
                { num: '16', title: 'Dispute Resolution' },
                { num: '17', title: 'Termination' },
                { num: '18', title: 'General Provisions' },
              ].map((item) => (
                <a
                  key={item.num}
                  href={`#section-${item.num}`}
                  className="text-sm font-light text-[var(--text-secondary)] hover:text-[var(--champagne)] transition-colors"
                >
                  {item.num}. {item.title}
                </a>
              ))}
            </nav>
          </div>

          {/* Introduction */}
          <div className="card-premium p-8 mb-6">
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Welcome to Luméra Beauty Academy. These Terms and Conditions (&quot;Terms&quot;, &quot;Agreement&quot;)
              constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, &quot;your&quot;) and
              Luméra Beauty Academy Ltd. (&quot;Luméra&quot;, &quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company
              registered in England and Wales (Company No. 12345678), with its registered office at
              71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
            </p>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              By accessing or using our website at www.lumera.academy (the &quot;Site&quot;) and any related
              services, applications, or platforms (collectively, the &quot;Platform&quot;), you acknowledge
              that you have read, understood, and agree to be bound by these Terms. If you do not
              agree to these Terms, you must not access or use the Platform.
            </p>
          </div>

          {/* Section 1 */}
          <div id="section-1" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">1. Acceptance of Terms</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">1.1 Agreement to Terms</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              By creating an account, accessing, browsing, or using the Platform in any manner, you
              represent and warrant that: (a) you are at least 18 years of age or the age of majority
              in your jurisdiction; (b) you have the legal capacity to enter into a binding agreement;
              (c) you are not prohibited from using the Platform under any applicable law; and (d) all
              registration information you submit is truthful and accurate.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">1.2 Modifications to Terms</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              We reserve the right to modify, amend, or update these Terms at any time at our sole
              discretion. Material changes will be notified to you via email to the address associated
              with your account or through a prominent notice on the Platform at least thirty (30) days
              before the changes take effect. Your continued use of the Platform after such modifications
              constitutes your acceptance of the updated Terms.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">1.3 Additional Policies</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              These Terms incorporate by reference our <Link href="/privacy" className="text-[var(--champagne)] hover:underline">Privacy Policy</Link>,
              Educator Agreement (for educators), Community Guidelines, and any other policies or guidelines
              posted on the Platform. In the event of a conflict between these Terms and any additional
              policies, these Terms shall prevail unless expressly stated otherwise.
            </p>
          </div>

          {/* Section 2 */}
          <div id="section-2" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">2. Definitions</h2>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              For the purposes of these Terms, the following definitions apply:
            </p>
            <ul className="space-y-3 text-[var(--text-secondary)] font-light">
              <li><strong>&quot;Content&quot;</strong> means all text, images, videos, audio, graphics, educational
              materials, live streams, recordings, and any other materials available on or through the Platform.</li>
              <li><strong>&quot;Educator&quot;</strong> means a registered user who has been approved by Luméra to
              create, publish, and deliver educational content, including live classes and video courses.</li>
              <li><strong>&quot;Student&quot;</strong> means a registered user who accesses the Platform to enroll
              in and participate in educational content offered by Educators.</li>
              <li><strong>&quot;Live Class&quot;</strong> means a real-time, interactive educational session conducted
              by an Educator through the Platform&apos;s video conferencing functionality.</li>
              <li><strong>&quot;Video Course&quot;</strong> means pre-recorded educational content uploaded by an
              Educator for on-demand access by Students.</li>
              <li><strong>&quot;Certificate&quot;</strong> means the digital document issued upon successful completion
              of a class or course, certifying the Student&apos;s participation.</li>
              <li><strong>&quot;User Content&quot;</strong> means any content, including but not limited to comments,
              chat messages, reviews, and profile information, submitted by users to the Platform.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div id="section-3" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">3. Account Registration</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">3.1 Account Creation</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              To access certain features of the Platform, you must register for an account. During
              registration, you agree to provide accurate, current, and complete information as prompted
              by the registration form. You must promptly update your account information to keep it
              accurate, current, and complete.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">3.2 Account Security</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You are solely responsible for maintaining the confidentiality of your account credentials,
              including your password. You agree to: (a) create a strong, unique password; (b) not share
              your account credentials with any third party; (c) immediately notify us at security@lumera.academy
              of any unauthorized access or use of your account; and (d) ensure you log out of your account
              at the end of each session when using a shared device.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">3.3 Account Responsibility</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You are fully responsible for all activities that occur under your account, whether or not
              authorized by you. Luméra shall not be liable for any loss or damage arising from your
              failure to comply with the above requirements.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">3.4 One Account Per Person</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Each individual may maintain only one Student account on the Platform. Creating multiple
              accounts to circumvent restrictions or abuse promotions is strictly prohibited and may
              result in immediate termination of all associated accounts.
            </p>
          </div>

          {/* Section 4 */}
          <div id="section-4" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">4. Platform Services</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">4.1 Nature of Services</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Luméra Beauty Academy operates as an online marketplace and platform connecting beauty
              professionals seeking education (&quot;Students&quot;) with experienced practitioners offering
              educational services (&quot;Educators&quot;). We provide the technology infrastructure and
              services to facilitate these connections but are not ourselves a provider of beauty
              education or training.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">4.2 Services Offered</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              The Platform enables:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Live interactive video classes with real-time educator-student interaction</li>
              <li>Pre-recorded video courses available for on-demand viewing</li>
              <li>Digital certificates of completion</li>
              <li>Messaging and communication tools between Students and Educators</li>
              <li>Payment processing for educational content purchases</li>
              <li>Reviews and ratings for classes and Educators</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">4.3 Service Availability</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              While we strive to maintain continuous Platform availability, we do not guarantee
              uninterrupted access. The Platform may be temporarily unavailable due to maintenance,
              updates, or circumstances beyond our control. We reserve the right to modify, suspend,
              or discontinue any aspect of the Platform at any time without prior notice.
            </p>
          </div>

          {/* Section 5 */}
          <div id="section-5" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">5. User Types and Responsibilities</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">5.1 Student Responsibilities</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              As a Student, you agree to:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Use purchased content solely for your personal, non-commercial educational purposes</li>
              <li>Not share, redistribute, or resell access to any purchased classes or courses</li>
              <li>Participate respectfully in live classes and adhere to Community Guidelines</li>
              <li>Provide honest and constructive feedback in reviews</li>
              <li>Ensure you meet any prerequisites specified for advanced classes</li>
              <li>Understand that completion of classes does not guarantee professional competency</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">5.2 Educator Responsibilities</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              As an Educator, you agree to:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Provide accurate information regarding your qualifications, credentials, and experience</li>
              <li>Maintain all necessary professional licenses and certifications in your jurisdiction</li>
              <li>Deliver educational content as described in your class or course listings</li>
              <li>Conduct all live classes at the scheduled times and for the stated duration</li>
              <li>Respond to student inquiries within a reasonable timeframe (typically 48 hours)</li>
              <li>Comply with the separate Educator Agreement and Platform guidelines</li>
              <li>Not engage in any discriminatory, harassing, or unprofessional conduct</li>
              <li>Ensure all content complies with applicable laws and industry standards</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">5.3 Educator Verification</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              All Educators undergo a verification process before being permitted to offer classes
              on the Platform. However, Luméra does not independently verify all claims made by
              Educators regarding their qualifications. Students are encouraged to review Educator
              profiles, ratings, and reviews before enrolling in classes.
            </p>
          </div>

          {/* Section 6 */}
          <div id="section-6" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">6. Payments and Fees</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">6.1 Pricing</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              All prices displayed on the Platform are in United States Dollars (USD) unless otherwise
              indicated. Prices are set by Educators for their respective content, subject to Platform
              guidelines. Luméra reserves the right to implement minimum and maximum pricing requirements.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">6.2 Payment Processing</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Payments are processed through our third-party payment processor, Stripe. By making a
              purchase, you agree to Stripe&apos;s terms of service. We accept major credit cards (Visa,
              Mastercard, American Express), debit cards, and other payment methods as displayed at
              checkout. All payments must be made in full at the time of purchase.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">6.3 Platform Fees</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Luméra charges Educators a platform fee of twenty percent (20%) on each transaction.
              This fee covers payment processing, platform infrastructure, customer support, and
              marketing services. The fee is automatically deducted from each sale before remittance
              to the Educator.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">6.4 Taxes</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Prices may be subject to applicable taxes (including VAT, GST, or sales tax) depending
              on your location. Any applicable taxes will be calculated and displayed at checkout.
              Educators are responsible for any tax obligations arising from their earnings on the Platform.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">6.5 Currency Conversion</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              If you pay in a currency other than USD, your payment provider may apply currency
              conversion fees. Luméra is not responsible for any additional charges imposed by
              your bank or payment provider.
            </p>
          </div>

          {/* Section 7 */}
          <div id="section-7" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">7. Cancellation and Refund Policy</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">7.1 Live Class Cancellations by Students</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Students may cancel their enrollment in a live class and receive a full refund if the
              cancellation is made:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li><strong>More than 72 hours before</strong> the scheduled class: 100% refund</li>
              <li><strong>24-72 hours before</strong> the scheduled class: 50% refund</li>
              <li><strong>Less than 24 hours before</strong> the scheduled class: No refund</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">7.2 Live Class Cancellations by Educators</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              If an Educator cancels a live class, all enrolled Students will receive a full refund
              automatically within 5-10 business days. Educators who repeatedly cancel classes may
              face account suspension or termination.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">7.3 Video Course Refunds</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Students may request a refund for video courses within fourteen (14) days of purchase,
              provided that:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Less than 30% of the course content has been accessed or viewed</li>
              <li>No certificate of completion has been issued</li>
              <li>The request is submitted through the Platform&apos;s refund request system</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">7.4 Technical Issues</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              If a live class is significantly disrupted due to technical issues on Luméra&apos;s end
              (Platform failure, not user connectivity issues), affected Students will be offered
              either a full refund or complimentary access to a rescheduled session at the Educator&apos;s
              discretion.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">7.5 Non-Refundable Items</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              The following are non-refundable:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Live classes after the class has commenced</li>
              <li>Video courses after 30% or more of the content has been accessed</li>
              <li>Classes or courses where a certificate has been issued</li>
              <li>Promotional or discounted purchases (unless required by law)</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">7.6 Refund Process</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Approved refunds will be processed to the original payment method within 5-10 business
              days. The actual time for funds to appear in your account may vary depending on your
              payment provider.
            </p>
          </div>

          {/* Section 8 */}
          <div id="section-8" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">8. Intellectual Property Rights</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">8.1 Platform Ownership</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              The Platform, including its source code, design, layout, graphics, logos, trademarks
              (&quot;Luméra&quot;, &quot;Luméra Beauty Academy&quot;, and associated logos), and all related intellectual
              property, are owned by or licensed to Luméra Beauty Academy Ltd. and are protected by
              copyright, trademark, and other intellectual property laws of the United Kingdom and
              international treaties.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">8.2 Educator Content Ownership</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Educators retain ownership of the educational content they create and upload to the
              Platform. By publishing content on the Platform, Educators grant Luméra a non-exclusive,
              worldwide, royalty-free license to host, display, distribute, and promote such content
              in connection with the Platform&apos;s services.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">8.3 Student License</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Upon purchasing a class or course, Students are granted a limited, non-exclusive,
              non-transferable, revocable license to access and view the content for personal,
              non-commercial educational purposes only. This license does not include the right to:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Download, copy, or reproduce content (except where explicitly permitted)</li>
              <li>Distribute, share, or publicly display content</li>
              <li>Create derivative works based on the content</li>
              <li>Use content for commercial purposes or to train others</li>
              <li>Remove any copyright or proprietary notices from content</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">8.4 Recording Prohibition</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Recording, screen capturing, or otherwise reproducing live classes without the express
              written consent of both the Educator and Luméra is strictly prohibited. Violation of
              this provision may result in immediate account termination and legal action.
            </p>
          </div>

          {/* Section 9 */}
          <div id="section-9" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">9. User Content and Conduct</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">9.1 User Content</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You are solely responsible for any content you submit, post, or transmit through the
              Platform. By submitting User Content, you grant Luméra a perpetual, irrevocable,
              worldwide, royalty-free license to use, reproduce, modify, and display such content
              in connection with the Platform.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">9.2 Prohibited Conduct</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Post content that is defamatory, obscene, abusive, or harassing</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Upload viruses, malware, or other malicious code</li>
              <li>Attempt to gain unauthorized access to any part of the Platform</li>
              <li>Interfere with or disrupt the Platform or servers</li>
              <li>Use automated systems (bots, scrapers) to access the Platform</li>
              <li>Circumvent or manipulate our fee structure or payment systems</li>
              <li>Engage in any fraudulent activity</li>
              <li>Solicit personal information from other users for unauthorized purposes</li>
              <li>Arrange transactions outside the Platform to avoid fees</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">9.3 Content Moderation</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Luméra reserves the right, but not the obligation, to monitor, review, and remove any
              User Content at our sole discretion. We may remove content that violates these Terms
              or that we find objectionable for any reason, without prior notice.
            </p>
          </div>

          {/* Section 10 */}
          <div id="section-10" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">10. Live Class Policies</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">10.1 Class Attendance</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Students are expected to join live classes on time. Late entry may be restricted at
              the Educator&apos;s discretion. If you miss a live class without canceling in advance,
              you are not entitled to a refund, though you may have access to the class recording
              for thirty (30) days, subject to the Educator&apos;s settings.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">10.2 Technical Requirements</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Students are responsible for ensuring they have:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>A stable internet connection (minimum 5 Mbps recommended)</li>
              <li>A compatible device with working camera and microphone</li>
              <li>A supported web browser (Chrome, Firefox, Safari, or Edge - latest versions)</li>
              <li>Appropriate physical space for practical demonstrations (if applicable)</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">10.3 Class Conduct</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              During live classes, participants must:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Treat all participants with respect and professionalism</li>
              <li>Keep microphones muted when not speaking (unless directed otherwise)</li>
              <li>Use appropriate language in chat and verbal communications</li>
              <li>Not share class links or access with unauthorized individuals</li>
              <li>Follow the Educator&apos;s instructions and class rules</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">10.4 Educator Removal Rights</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Educators have the right to remove any participant from a live class who is disruptive,
              violates Community Guidelines, or whose behavior negatively impacts other participants&apos;
              experience. Removed participants are not entitled to refunds.
            </p>
          </div>

          {/* Section 11 */}
          <div id="section-11" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">11. Certificates</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">11.1 Certificate Issuance</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Certificates are issued to Students upon successful completion of eligible classes
              and courses. Completion is determined by the Educator based on class requirements,
              which may include attendance, participation, or assessment completion.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">11.2 Certificate Limitations</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              <strong>IMPORTANT:</strong> Certificates issued by Luméra Beauty Academy are certificates
              of completion only and:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Do NOT constitute professional licensure or certification</li>
              <li>Do NOT qualify holders to perform regulated procedures without proper licensing</li>
              <li>Do NOT replace any legally required training or certification in your jurisdiction</li>
              <li>Are NOT accredited by governmental or official accreditation bodies</li>
              <li>Should NOT be represented as professional qualifications</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">11.3 Professional Responsibility</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Students are solely responsible for understanding and complying with all licensing,
              certification, and regulatory requirements applicable to beauty and aesthetic procedures
              in their jurisdiction. Completion of courses on this Platform does not authorize you
              to perform any procedure that requires professional licensure.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">11.4 Certificate Verification</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Each certificate includes a unique verification code that can be verified through our
              website. Certificates remain valid indefinitely unless revoked due to fraud or
              misrepresentation.
            </p>
          </div>

          {/* Section 12 */}
          <div id="section-12" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">12. Privacy and Data Protection</h2>

            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Your privacy is important to us. Our collection, use, and protection of your personal
              data is governed by our <Link href="/privacy" className="text-[var(--champagne)] hover:underline">Privacy Policy</Link>,
              which is incorporated into these Terms by reference.
            </p>

            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              By using the Platform, you consent to:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>The collection and processing of your personal data as described in our Privacy Policy</li>
              <li>The recording of live classes for quality assurance and replay purposes</li>
              <li>The use of cookies and similar technologies as described in our Cookie Policy</li>
              <li>The transfer of your data to countries outside the European Economic Area where necessary</li>
            </ul>

            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              We comply with the UK General Data Protection Regulation (UK GDPR) and the Data
              Protection Act 2018. EU users are also protected under the EU GDPR through our
              Standard Contractual Clauses.
            </p>
          </div>

          {/* Section 13 */}
          <div id="section-13" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">13. Disclaimers</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">13.1 Platform Provided &quot;As Is&quot;</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              THE PLATFORM AND ALL CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS
              WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              TO THE FULLEST EXTENT PERMITTED BY LAW, LUMÉRA DISCLAIMS ALL WARRANTIES, INCLUDING
              BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">13.2 Educational Content Disclaimer</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Educational content on the Platform is provided for informational and educational
              purposes only. It does not constitute:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Medical, dermatological, or professional health advice</li>
              <li>A substitute for professional training required by law</li>
              <li>Authorization to perform any medical or regulated procedure</li>
              <li>A guarantee of specific outcomes or results</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">13.3 Third-Party Disclaimer</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Luméra does not endorse, guarantee, or assume responsibility for any content created
              by Educators or any products, services, or techniques recommended by them. Any reliance
              on such information is at your own risk.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">13.4 No Professional Relationship</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Luméra acts solely as a platform facilitating connections between Students and Educators.
              We are not an employer, employee, agent, or partner of any Educator, and no employment,
              agency, partnership, or joint venture relationship is created by these Terms or use
              of the Platform.
            </p>
          </div>

          {/* Section 14 */}
          <div id="section-14" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">14. Limitation of Liability</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">14.1 Exclusion of Damages</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LUMÉRA, ITS
              DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT
              NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE
              LOSSES, ARISING OUT OF OR IN CONNECTION WITH:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Your use of or inability to use the Platform</li>
              <li>Any content obtained from the Platform</li>
              <li>Unauthorized access to or alteration of your transmissions or data</li>
              <li>Statements or conduct of any third party on the Platform</li>
              <li>Any other matter relating to the Platform</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">14.2 Liability Cap</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              To the extent permitted by applicable law, Luméra&apos;s total cumulative liability
              arising out of or related to these Terms or the Platform shall not exceed the greater
              of: (a) the total fees paid by you to Luméra during the twelve (12) months preceding
              the claim; or (b) one hundred United States Dollars (USD $100).
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">14.3 Jurisdictional Limitations</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Some jurisdictions do not allow the exclusion or limitation of certain damages. In
              such jurisdictions, our liability shall be limited to the maximum extent permitted
              by law. Nothing in these Terms excludes or limits our liability for death or personal
              injury caused by our negligence, fraud, or any other liability that cannot be excluded
              by law.
            </p>
          </div>

          {/* Section 15 */}
          <div id="section-15" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">15. Indemnification</h2>

            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless Luméra Beauty Academy Ltd., its
              officers, directors, employees, agents, licensors, and suppliers from and against
              any and all claims, liabilities, damages, losses, costs, and expenses (including
              reasonable attorneys&apos; fees) arising out of or related to:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party, including other users</li>
              <li>Any content you submit, post, or transmit through the Platform</li>
              <li>Your negligent or wrongful conduct</li>
              <li>Any professional services you provide based on content from the Platform</li>
            </ul>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              This indemnification obligation shall survive the termination of these Terms and
              your use of the Platform.
            </p>
          </div>

          {/* Section 16 */}
          <div id="section-16" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">16. Dispute Resolution</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">16.1 Informal Resolution</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Before filing any formal legal proceeding, you agree to attempt to resolve any
              dispute informally by contacting us at disputes@lumera.academy. We will attempt
              to resolve the dispute informally within sixty (60) days.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">16.2 Governing Law</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              These Terms and any dispute arising out of or related to them shall be governed by
              and construed in accordance with the laws of England and Wales, without regard to
              its conflict of law provisions.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">16.3 Jurisdiction</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Any disputes arising out of or related to these Terms shall be subject to the
              exclusive jurisdiction of the courts of England and Wales. However, we retain
              the right to bring proceedings in any jurisdiction where you reside or have assets.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">16.4 EU Consumer Rights</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              If you are a consumer residing in the European Union, you may also bring proceedings
              in the courts of your country of residence. Additionally, you may use the European
              Commission&apos;s Online Dispute Resolution platform at https://ec.europa.eu/consumers/odr.
            </p>
          </div>

          {/* Section 17 */}
          <div id="section-17" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">17. Termination</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">17.1 Termination by You</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You may terminate your account at any time by submitting a request through the
              Platform settings or by contacting support@lumera.academy. Upon termination,
              you will lose access to all purchased content and features.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">17.2 Termination by Luméra</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              We may suspend or terminate your account and access to the Platform at any time,
              with or without cause and with or without notice, including but not limited to
              situations where:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] font-light space-y-2 mb-4">
              <li>You breach any provision of these Terms</li>
              <li>We are required to do so by law</li>
              <li>We suspect fraudulent, abusive, or illegal activity</li>
              <li>Your account has been inactive for more than twelve (12) months</li>
              <li>We discontinue the Platform or any part thereof</li>
            </ul>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">17.3 Effect of Termination</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              Upon termination: (a) all licenses granted to you under these Terms will immediately
              cease; (b) you must immediately stop using the Platform; (c) we may delete your
              account data in accordance with our Privacy Policy; (d) any pending transactions
              may be cancelled. Provisions that by their nature should survive termination shall
              survive, including intellectual property, disclaimers, limitation of liability,
              and indemnification.
            </p>
          </div>

          {/* Section 18 */}
          <div id="section-18" className="card-premium p-8 mb-6">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">18. General Provisions</h2>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">18.1 Entire Agreement</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              These Terms, together with the Privacy Policy and any other policies incorporated
              by reference, constitute the entire agreement between you and Luméra regarding your
              use of the Platform and supersede all prior agreements and understandings.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">18.2 Severability</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable,
              the remaining provisions shall continue in full force and effect. The invalid
              provision shall be modified to the minimum extent necessary to make it valid
              and enforceable.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">18.3 Waiver</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Our failure to enforce any right or provision of these Terms shall not constitute
              a waiver of such right or provision. Any waiver must be in writing and signed by
              an authorized representative of Luméra.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">18.4 Assignment</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              You may not assign or transfer these Terms or your rights hereunder without our
              prior written consent. We may assign these Terms without restriction.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">18.5 Force Majeure</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed mb-4">
              Luméra shall not be liable for any failure or delay in performing our obligations
              where such failure or delay results from circumstances beyond our reasonable control,
              including but not limited to acts of God, natural disasters, war, terrorism, riots,
              embargoes, acts of civil or military authorities, fire, floods, accidents, pandemic,
              strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
            </p>

            <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">18.6 Contact Information</h3>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
          </div>

          {/* Contact Section */}
          <div className="card-premium p-8">
            <h2 className="text-2xl font-light text-[var(--charcoal)] mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">General Inquiries</h3>
                <p className="text-[var(--text-secondary)] font-light">
                  Luméra Beauty Academy Ltd.<br />
                  71-75 Shelton Street<br />
                  Covent Garden<br />
                  London, WC2H 9JQ<br />
                  United Kingdom<br /><br />
                  Email: legal@lumera.academy<br />
                  Support: support@lumera.academy
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[var(--charcoal)] mb-3">Data Protection</h3>
                <p className="text-[var(--text-secondary)] font-light">
                  Data Protection Officer<br />
                  Email: dpo@lumera.academy<br /><br />
                  For GDPR-related inquiries or to exercise your data protection rights,
                  please contact our Data Protection Officer.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
              <p className="text-sm text-[var(--text-muted)] font-light">
                Company Registration Number: 12345678 (England and Wales)<br />
                VAT Registration Number: GB 123 4567 89<br />
                ICO Registration Number: ZA123456
              </p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="mt-8 p-6 bg-[var(--beige)] rounded">
            <p className="text-sm text-[var(--text-secondary)] font-light text-center">
              By using Luméra Beauty Academy, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions. If you do not agree to these
              Terms, please do not use the Platform.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
