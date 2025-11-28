package com.lumera.academy.controller;

import com.lumera.academy.dto.UpdateWatchProgressRequest;
import com.lumera.academy.dto.WatchProgressDTO;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.UserRepository;
import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.service.WatchProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/watch-progress")
@RequiredArgsConstructor
@Tag(name = "Watch Progress", description = "Video watch progress tracking endpoints")
public class WatchProgressController {

    private final WatchProgressService watchProgressService;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all watch progress for current user")
    public ResponseEntity<List<WatchProgressDTO>> getMyProgress(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = getCurrentUserId(jwt);
        return ResponseEntity.ok(watchProgressService.getUserProgress(userId));
    }

    @GetMapping("/completed")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get completed classes for current user")
    public ResponseEntity<List<WatchProgressDTO>> getMyCompletedClasses(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = getCurrentUserId(jwt);
        return ResponseEntity.ok(watchProgressService.getCompletedClasses(userId));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get watch progress for a specific class")
    public ResponseEntity<WatchProgressDTO> getProgressForClass(
            @PathVariable UUID classId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = getCurrentUserId(jwt);
        WatchProgressDTO progress = watchProgressService.getProgress(userId, classId);
        if (progress == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(progress);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update watch progress (called periodically during video playback)")
    public ResponseEntity<WatchProgressDTO> updateProgress(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateWatchProgressRequest request
    ) {
        UUID userId = getCurrentUserId(jwt);
        return ResponseEntity.ok(watchProgressService.updateProgress(userId, request));
    }

    @GetMapping("/class/{classId}/completed")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check if current user has completed a class")
    public ResponseEntity<Boolean> hasCompletedClass(
            @PathVariable UUID classId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = getCurrentUserId(jwt);
        return ResponseEntity.ok(watchProgressService.hasCompleted(userId, classId));
    }

    private UUID getCurrentUserId(Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return user.getId();
    }
}
