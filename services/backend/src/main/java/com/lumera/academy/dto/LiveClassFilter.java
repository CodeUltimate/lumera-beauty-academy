package com.lumera.academy.dto;

import com.lumera.academy.entity.LiveClass;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class LiveClassFilter {
    private String status; // upcoming, past, draft, all
    private UUID categoryId;
    private LiveClass.SkillLevel skillLevel;
    private Instant startDate;
    private Instant endDate;
    private String search;
}
