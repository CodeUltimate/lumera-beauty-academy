package com.lumera.academy.dto;

import com.lumera.academy.entity.WatchProgress;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class WatchProgressDTO {

    private UUID id;
    private UUID userId;
    private UUID liveClassId;
    private String classTitle;
    private Integer watchedSeconds;
    private Integer totalDurationSeconds;
    private Double watchPercentage;
    private Integer lastPosition;
    private boolean completed;
    private Instant completedAt;
    private Instant lastWatchedAt;

    public static WatchProgressDTO fromEntity(WatchProgress progress) {
        return WatchProgressDTO.builder()
                .id(progress.getId())
                .userId(progress.getUser().getId())
                .liveClassId(progress.getLiveClass().getId())
                .classTitle(progress.getLiveClass().getTitle())
                .watchedSeconds(progress.getWatchedSeconds())
                .totalDurationSeconds(progress.getTotalDurationSeconds())
                .watchPercentage(progress.getWatchPercentage())
                .lastPosition(progress.getLastPosition())
                .completed(progress.isCompleted())
                .completedAt(progress.getCompletedAt())
                .lastWatchedAt(progress.getLastWatchedAt())
                .build();
    }
}
