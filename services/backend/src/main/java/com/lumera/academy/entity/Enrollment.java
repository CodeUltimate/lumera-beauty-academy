package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "live_class_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_class_id", nullable = false)
    private LiveClass liveClass;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(precision = 10, scale = 2)
    private BigDecimal educatorEarning;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentIntentId;

    private Instant enrolledAt;

    private Instant attendedAt;

    private Integer attendanceDurationMinutes;

    private boolean certificateIssued;

    public enum EnrollmentStatus {
        PENDING, CONFIRMED, ATTENDED, COMPLETED, CANCELLED, REFUNDED
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED, PARTIALLY_REFUNDED
    }
}
