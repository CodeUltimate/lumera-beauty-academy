package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String certificateNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_class_id", nullable = false)
    private LiveClass liveClass;

    @Column(nullable = false)
    private Instant issuedAt;

    private Instant expiresAt;

    private String pdfUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean revoked = false;

    private String revokedReason;

    private Instant revokedAt;

    @PrePersist
    public void prePersist() {
        if (certificateNumber == null) {
            // Generate certificate number: LBA-YYYY-XXXXX
            certificateNumber = "LBA-" + java.time.Year.now().getValue() + "-" +
                String.format("%05d", (int) (Math.random() * 100000));
        }
        if (issuedAt == null) {
            issuedAt = Instant.now();
        }
    }
}
