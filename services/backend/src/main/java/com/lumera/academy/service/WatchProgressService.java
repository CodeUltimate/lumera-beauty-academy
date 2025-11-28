package com.lumera.academy.service;

import com.lumera.academy.dto.UpdateWatchProgressRequest;
import com.lumera.academy.dto.WatchProgressDTO;
import com.lumera.academy.entity.LiveClass;
import com.lumera.academy.entity.User;
import com.lumera.academy.entity.WatchProgress;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.LiveClassRepository;
import com.lumera.academy.repository.UserRepository;
import com.lumera.academy.repository.WatchProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final UserRepository userRepository;
    private final LiveClassRepository liveClassRepository;
    private final CertificateService certificateService;

    /**
     * Get watch progress for a specific class and user
     */
    public WatchProgressDTO getProgress(UUID userId, UUID liveClassId) {
        return watchProgressRepository.findByUserIdAndLiveClassId(userId, liveClassId)
                .map(WatchProgressDTO::fromEntity)
                .orElse(null);
    }

    /**
     * Get all watch progress for a user
     */
    public List<WatchProgressDTO> getUserProgress(UUID userId) {
        return watchProgressRepository.findByUserId(userId)
                .stream()
                .map(WatchProgressDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get completed classes for a user
     */
    public List<WatchProgressDTO> getCompletedClasses(UUID userId) {
        return watchProgressRepository.findByUserIdAndCompletedTrue(userId)
                .stream()
                .map(WatchProgressDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update watch progress - called periodically by frontend during video playback
     */
    @Transactional
    public WatchProgressDTO updateProgress(UUID userId, UpdateWatchProgressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        LiveClass liveClass = liveClassRepository.findById(request.getLiveClassId())
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", request.getLiveClassId()));

        WatchProgress progress = watchProgressRepository
                .findByUserIdAndLiveClassId(userId, request.getLiveClassId())
                .orElseGet(() -> WatchProgress.builder()
                        .user(user)
                        .liveClass(liveClass)
                        .build());

        boolean wasCompleted = progress.isCompleted();

        // Update progress
        progress.updateProgress(request.getCurrentPosition(), request.getTotalDuration());

        WatchProgress saved = watchProgressRepository.save(progress);

        // If just completed (90%+ watched), auto-issue certificate
        if (!wasCompleted && saved.isCompleted()) {
            log.info("Student {} completed class {} - triggering certificate generation",
                    userId, request.getLiveClassId());
            certificateService.issueCertificate(userId, request.getLiveClassId());
        }

        return WatchProgressDTO.fromEntity(saved);
    }

    /**
     * Check if user has completed a class
     */
    public boolean hasCompleted(UUID userId, UUID liveClassId) {
        return watchProgressRepository.existsByUserIdAndLiveClassIdAndCompletedTrue(userId, liveClassId);
    }

    /**
     * Get completion count for a user
     */
    public long getCompletionCount(UUID userId) {
        return watchProgressRepository.countByUserIdAndCompletedTrue(userId);
    }

    /**
     * Get completion count for all classes by an educator
     */
    public long getEducatorCompletionCount(UUID educatorId) {
        return watchProgressRepository.countCompletedByEducatorId(educatorId);
    }
}
