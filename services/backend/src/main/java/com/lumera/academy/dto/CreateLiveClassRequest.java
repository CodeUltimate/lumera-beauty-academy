package com.lumera.academy.dto;

import com.lumera.academy.entity.LiveClass;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
public class CreateLiveClassRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 50, max = 5000, message = "Description must be between 50 and 5000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.00", message = "Price must be non-negative")
    @DecimalMax(value = "9999.99", message = "Price must not exceed 9999.99")
    private BigDecimal price;

    @NotNull(message = "Duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 480, message = "Duration must not exceed 8 hours")
    private Integer durationMinutes;

    @Min(value = 1, message = "Max students must be at least 1")
    @Max(value = 1000, message = "Max students must not exceed 1000")
    private Integer maxStudents;

    // scheduledAt is required for publishing, optional for drafts
    @Future(message = "Scheduled time must be in the future")
    private Instant scheduledAt;

    @NotNull(message = "Category is required")
    private UUID categoryId;

    private LiveClass.SkillLevel skillLevel = LiveClass.SkillLevel.ALL_LEVELS;

    // If true, saves as draft without requiring scheduledAt
    private boolean draft = false;

    private String thumbnailUrl;

    @Size(max = 10, message = "Maximum 10 topics allowed")
    private Set<String> topics;

    @Size(max = 10, message = "Maximum 10 requirements allowed")
    private Set<String> requirements;
}
