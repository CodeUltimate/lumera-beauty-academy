'use client';

import { Certificate } from '@/types';
import { formatDate } from '@/lib/utils';

interface CertificatePreviewProps {
  certificate: Certificate;
  onDownload?: () => void;
}

export default function CertificatePreview({ certificate, onDownload }: CertificatePreviewProps) {
  return (
    <div className="bg-white border border-[var(--border-light)] rounded-lg overflow-hidden">
      {/* Certificate Visual */}
      <div className="aspect-[1.4/1] bg-gradient-to-br from-[var(--cream)] to-white p-8 relative">
        {/* Border decoration */}
        <div className="absolute inset-4 border-2 border-[var(--champagne)]/30 rounded" />
        <div className="absolute inset-6 border border-[var(--champagne)]/20 rounded" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center">
          {/* Logo */}
          <div className="mb-4">
            <h3 className="text-xl font-light tracking-tight text-[var(--charcoal)]">Luméra</h3>
            <p className="text-[8px] font-light tracking-[0.3em] uppercase text-[var(--text-muted)]">
              Beauty Academy
            </p>
          </div>

          {/* Title */}
          <p className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--champagne)] mb-2">
            Certificate of Completion
          </p>

          {/* Decorative line */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--champagne)] to-transparent mb-4" />

          {/* Student Name */}
          <p className="text-lg font-light text-[var(--charcoal)] mb-1">
            {certificate.studentName}
          </p>

          {/* Has successfully completed */}
          <p className="text-[10px] font-light text-[var(--text-muted)] mb-2">
            has successfully completed
          </p>

          {/* Course Name */}
          <p className="text-sm font-light text-[var(--charcoal)] mb-4 max-w-[80%] leading-tight">
            {certificate.className}
          </p>

          {/* Educator */}
          <p className="text-[10px] font-light text-[var(--text-muted)]">
            Instructed by <span className="text-[var(--charcoal)]">{certificate.educatorName}</span>
          </p>

          {/* Date & ID */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8">
            <div className="text-left">
              <p className="text-[8px] font-light text-[var(--text-muted)]">Date Issued</p>
              <p className="text-[10px] font-light text-[var(--charcoal)]">
                {formatDate(certificate.issuedAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-light text-[var(--text-muted)]">Certificate ID</p>
              <p className="text-[10px] font-light text-[var(--charcoal)]">
                {certificate.certificateNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[var(--border-light)] flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--charcoal)]">{certificate.className}</p>
          <p className="text-xs font-light text-[var(--text-muted)]">
            Issued {formatDate(certificate.issuedAt)}
          </p>
        </div>
        <button onClick={onDownload} className="btn-secondary text-xs">
          Download PDF
        </button>
      </div>
    </div>
  );
}
