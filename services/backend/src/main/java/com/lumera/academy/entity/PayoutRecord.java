package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payout_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayoutRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "educator_id", nullable = false)
    private User educator;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal platformFeeTotal = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.PENDING;

    private String payoutMethod;

    private String payoutReference;

    private Instant scheduledAt;

    private Instant processedAt;

    private String failureReason;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum PayoutStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}
