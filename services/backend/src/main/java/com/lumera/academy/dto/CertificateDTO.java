package com.lumera.academy.dto;

import com.lumera.academy.entity.Certificate;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class CertificateDTO {

    private UUID id;
    private String certificateNumber;
    private UUID userId;
    private String studentName;
    private UUID liveClassId;
    private String className;
    private String educatorName;
    private Instant issuedAt;
    private Instant expiresAt;
    private String pdfUrl;
    private boolean revoked;

    public static CertificateDTO fromEntity(Certificate certificate) {
        return CertificateDTO.builder()
                .id(certificate.getId())
                .certificateNumber(certificate.getCertificateNumber())
                .userId(certificate.getUser().getId())
                .studentName(certificate.getUser().getFullName())
                .liveClassId(certificate.getLiveClass().getId())
                .className(certificate.getLiveClass().getTitle())
                .educatorName(certificate.getLiveClass().getEducator().getFullName())
                .issuedAt(certificate.getIssuedAt())
                .expiresAt(certificate.getExpiresAt())
                .pdfUrl(certificate.getPdfUrl())
                .revoked(certificate.isRevoked())
                .build();
    }
}
