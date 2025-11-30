'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Award } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CertificatePreview from '@/components/ui/CertificatePreview';
import { Certificate } from '@/types';
// Utils imported if needed in future

// Mock certificates data
const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    studentId: 'student-1',
    studentName: 'Emma Thompson',
    classId: 'class-1',
    className: 'Advanced Lip Filler Techniques: Russian Lips Masterclass',
    educatorId: 'edu-1',
    educatorName: 'Dr. Sophia Laurent',
    issuedAt: new Date('2024-10-15'),
    certificateNumber: 'LBA-M4X7K9-2B3F',
  },
  {
    id: 'cert-2',
    studentId: 'student-1',
    studentName: 'Emma Thompson',
    classId: 'class-2',
    className: 'Microblading Foundation: From Beginner to Confident Artist',
    educatorId: 'edu-2',
    educatorName: 'Isabella Chen',
    issuedAt: new Date('2024-09-22'),
    certificateNumber: 'LBA-K8P3L2-7N4M',
  },
  {
    id: 'cert-3',
    studentId: 'student-1',
    studentName: 'Emma Thompson',
    classId: 'class-3',
    className: 'Chemical Peels: Protocols for Every Skin Type',
    educatorId: 'edu-1',
    educatorName: 'Dr. Sophia Laurent',
    issuedAt: new Date('2024-08-10'),
    certificateNumber: 'LBA-R2V5T8-9Q1X',
  },
  {
    id: 'cert-4',
    studentId: 'student-1',
    studentName: 'Emma Thompson',
    classId: 'class-4',
    className: 'Scale Your Beauty Business to 6 Figures',
    educatorId: 'edu-4',
    educatorName: 'Elena Petrova',
    issuedAt: new Date('2024-07-05'),
    certificateNumber: 'LBA-W6Y4Z1-3C8H',
  },
  {
    id: 'cert-5',
    studentId: 'student-1',
    studentName: 'Emma Thompson',
    classId: 'class-5',
    className: 'Classic Lash Extensions: Perfect Placement Technique',
    educatorId: 'edu-2',
    educatorName: 'Isabella Chen',
    issuedAt: new Date('2024-06-18'),
    certificateNumber: 'LBA-J9G2D5-6F7A',
  },
];

export default function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setSelectedCertificate] = useState<Certificate | null>(null);

  const filteredCertificates = mockCertificates.filter(
    (cert) =>
      cert.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.educatorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (certificate: Certificate) => {
    // In production, this would generate and download a PDF
    alert(`Downloading certificate: ${certificate.certificateNumber}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/student"
            className="inline-flex items-center space-x-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--charcoal)] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extralight text-[var(--charcoal)]">My Certificates</h1>
              <p className="text-[var(--text-secondary)] font-light mt-1">
                {mockCertificates.length} certificates earned
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates..."
              className="input-premium pl-12"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCertificates.map((certificate) => (
              <CertificatePreview
                key={certificate.id}
                certificate={certificate}
                onDownload={() => handleDownload(certificate)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-[var(--border)] mx-auto mb-4" />
            <h3 className="text-lg font-light text-[var(--charcoal)] mb-2">No certificates found</h3>
            <p className="text-[var(--text-muted)] font-light">
              {searchQuery
                ? 'Try a different search term'
                : 'Complete classes to earn certificates'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
