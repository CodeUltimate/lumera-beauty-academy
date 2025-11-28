package com.lumera.academy.dto;

import com.lumera.academy.entity.LiveClass;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class LiveClassDTO {

    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer durationMinutes;
    private Integer maxStudents;
    private Instant scheduledAt;
    private Instant startedAt;
    private Instant endedAt;
    private LiveClass.ClassStatus status;
    private String thumbnailUrl;
    private String recordingUrl;
    private LiveClass.SkillLevel skillLevel;
    private Set<String> topics;
    private Set<String> requirements;

    private EducatorSummary educator;
    private CategorySummary category;
    private int enrollmentCount;
    private boolean hasAvailableSpots;

    private Instant createdAt;

    @Data
    @Builder
    public static class EducatorSummary {
        private UUID id;
        private String name;
        private String avatarUrl;
        private String specialty;
    }

    @Data
    @Builder
    public static class CategorySummary {
        private UUID id;
        private String name;
        private String slug;
    }

    public static LiveClassDTO fromEntity(LiveClass liveClass) {
        return LiveClassDTO.builder()
                .id(liveClass.getId())
                .title(liveClass.getTitle())
                .description(liveClass.getDescription())
                .price(liveClass.getPrice())
                .durationMinutes(liveClass.getDurationMinutes())
                .maxStudents(liveClass.getMaxStudents())
                .scheduledAt(liveClass.getScheduledAt())
                .startedAt(liveClass.getStartedAt())
                .endedAt(liveClass.getEndedAt())
                .status(liveClass.getStatus())
                .thumbnailUrl(liveClass.getThumbnailUrl())
                .recordingUrl(liveClass.getRecordingUrl())
                .skillLevel(liveClass.getSkillLevel())
                .topics(liveClass.getTopics())
                .requirements(liveClass.getRequirements())
                .educator(EducatorSummary.builder()
                        .id(liveClass.getEducator().getId())
                        .name(liveClass.getEducator().getFullName())
                        .avatarUrl(liveClass.getEducator().getAvatarUrl())
                        .specialty(liveClass.getEducator().getSpecialty())
                        .build())
                .category(CategorySummary.builder()
                        .id(liveClass.getCategory().getId())
                        .name(liveClass.getCategory().getName())
                        .slug(liveClass.getCategory().getSlug())
                        .build())
                .enrollmentCount(liveClass.getEnrollmentCount())
                .hasAvailableSpots(liveClass.hasAvailableSpots())
                .createdAt(liveClass.getCreatedAt())
                .build();
    }
}
