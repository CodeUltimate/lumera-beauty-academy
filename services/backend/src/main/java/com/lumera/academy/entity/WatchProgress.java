package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "watch_progress", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "live_class_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchProgress extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "live_class_id", nullable = false)
    private LiveClass liveClass;

    @Column(nullable = false)
    @Builder.Default
    private Integer watchedSeconds = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalDurationSeconds = 0;

    @Column(nullable = false)
    @Builder.Default
    private Double watchPercentage = 0.0;

    // Last playback position in seconds (for resume functionality)
    @Column(nullable = false)
    @Builder.Default
    private Integer lastPosition = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean completed = false;

    private Instant completedAt;

    private Instant lastWatchedAt;

    /**
     * Updates watch progress and calculates percentage.
     * Triggers completion if threshold is reached.
     */
    public void updateProgress(int currentPosition, int totalDuration) {
        this.lastPosition = currentPosition;
        this.totalDurationSeconds = totalDuration;
        this.lastWatchedAt = Instant.now();

        // Update watched seconds (only if current position is further than before)
        if (currentPosition > this.watchedSeconds) {
            this.watchedSeconds = currentPosition;
        }

        // Calculate percentage
        if (totalDuration > 0) {
            this.watchPercentage = (double) this.watchedSeconds / totalDuration * 100;
        }

        // Mark as completed if 90% or more watched
        if (this.watchPercentage >= 90.0 && !this.completed) {
            this.completed = true;
            this.completedAt = Instant.now();
        }
    }
}
