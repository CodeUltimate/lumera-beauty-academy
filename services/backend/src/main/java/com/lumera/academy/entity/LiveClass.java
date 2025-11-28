package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "live_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveClass extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer durationMinutes;

    private Integer maxStudents;

    // Nullable for draft classes
    private Instant scheduledAt;

    private Instant startedAt;

    private Instant endedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ClassStatus status = ClassStatus.SCHEDULED;

    private String thumbnailUrl;

    private String recordingUrl;

    private String meetingUrl;

    private String meetingId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SkillLevel skillLevel = SkillLevel.ALL_LEVELS;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "live_class_topics", joinColumns = @JoinColumn(name = "live_class_id"))
    @Column(name = "topic")
    @Builder.Default
    private Set<String> topics = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "live_class_requirements", joinColumns = @JoinColumn(name = "live_class_id"))
    @Column(name = "requirement")
    @Builder.Default
    private Set<String> requirements = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "educator_id", nullable = false)
    private User educator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "liveClass", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Enrollment> enrollments = new HashSet<>();

    @OneToMany(mappedBy = "liveClass", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Certificate> certificates = new HashSet<>();

    // Computed enrollment count using @Formula to avoid lazy loading issues
    @org.hibernate.annotations.Formula("(SELECT COUNT(*) FROM enrollments e WHERE e.live_class_id = id)")
    private int enrollmentCount;

    public int getEnrollmentCount() {
        return enrollmentCount;
    }

    public boolean hasAvailableSpots() {
        return maxStudents == null || enrollmentCount < maxStudents;
    }

    public enum ClassStatus {
        DRAFT, SCHEDULED, LIVE, COMPLETED, CANCELLED
    }

    public enum SkillLevel {
        BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS
    }
}
