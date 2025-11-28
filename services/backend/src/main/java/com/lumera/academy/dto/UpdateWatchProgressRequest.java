package com.lumera.academy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class UpdateWatchProgressRequest {

    @NotNull(message = "Class ID is required")
    private UUID liveClassId;

    @NotNull(message = "Current position is required")
    @Min(value = 0, message = "Position cannot be negative")
    private Integer currentPosition;

    @NotNull(message = "Total duration is required")
    @Min(value = 1, message = "Duration must be at least 1 second")
    private Integer totalDuration;
}
