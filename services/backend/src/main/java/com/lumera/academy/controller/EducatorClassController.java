package com.lumera.academy.controller;

import com.lumera.academy.dto.CreateLiveClassRequest;
import com.lumera.academy.dto.LiveClassDTO;
import com.lumera.academy.dto.LiveClassFilter;
import com.lumera.academy.entity.LiveClass;
import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.service.LiveClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/v1/educator/classes")
@PreAuthorize("hasRole('EDUCATOR')")
@RequiredArgsConstructor
@Tag(name = "Educator Classes", description = "Educator class management endpoints")
public class EducatorClassController {

    private final LiveClassService liveClassService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get my classes with optional filters")
    public ResponseEntity<Page<LiveClassDTO>> getMyClasses(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false, defaultValue = "all") String filter,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) LiveClass.SkillLevel skillLevel,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 12, sort = "scheduledAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);

        // Build filter object
        LiveClassFilter classFilter = new LiveClassFilter();
        classFilter.setStatus(filter);
        classFilter.setCategoryId(categoryId);
        classFilter.setSkillLevel(skillLevel);
        classFilter.setStartDate(startDate);
        classFilter.setEndDate(endDate);
        classFilter.setSearch(search);

        return ResponseEntity.ok(liveClassService.getMyClassesWithFiltersByEmail(email, classFilter, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('EDUCATOR') and @emailVerifier.isVerified(authentication)")
    @Operation(summary = "Create a new live class")
    public ResponseEntity<LiveClassDTO> createClass(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateLiveClassRequest request
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(liveClassService.createClassByEmail(email, request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get one of my classes by ID")
    public ResponseEntity<LiveClassDTO> getMyClassById(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        return ResponseEntity.ok(liveClassService.getMyClassByIdAndEmail(id, email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EDUCATOR') and @emailVerifier.isVerified(authentication)")
    @Operation(summary = "Update one of my classes")
    public ResponseEntity<LiveClassDTO> updateClass(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateLiveClassRequest request
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        return ResponseEntity.ok(liveClassService.updateClassByEmail(id, email, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EDUCATOR') and @emailVerifier.isVerified(authentication)")
    @Operation(summary = "Cancel one of my classes")
    public ResponseEntity<Void> cancelClass(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        liveClassService.cancelClassByEmail(id, email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('EDUCATOR') and @emailVerifier.isVerified(authentication)")
    @Operation(summary = "Start a live class")
    public ResponseEntity<Void> startClass(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String meetingUrl
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        liveClassService.startClassByEmail(id, email, meetingUrl);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/end")
    @PreAuthorize("hasRole('EDUCATOR') and @emailVerifier.isVerified(authentication)")
    @Operation(summary = "End a live class")
    public ResponseEntity<Void> endClass(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String recordingUrl
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        liveClassService.endClassByEmail(id, email, recordingUrl);
        return ResponseEntity.ok().build();
    }
}
