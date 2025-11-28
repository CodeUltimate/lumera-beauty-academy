package com.lumera.academy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSummaryDTO {
    private UUID id;
    private String name;
    private String email;
    private String avatarUrl;
    private long enrolledClasses;
    private long completedClasses;
    private Instant firstEnrolledAt;
}
