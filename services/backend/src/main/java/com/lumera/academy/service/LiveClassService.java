package com.lumera.academy.service;

import com.lumera.academy.dto.CreateLiveClassRequest;
import com.lumera.academy.dto.LiveClassDTO;
import com.lumera.academy.dto.LiveClassFilter;
import com.lumera.academy.entity.Category;
import com.lumera.academy.entity.LiveClass;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.CategoryRepository;
import com.lumera.academy.repository.LiveClassRepository;
import com.lumera.academy.repository.LiveClassSpecification;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LiveClassService {

    private final LiveClassRepository liveClassRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public Page<LiveClassDTO> getUpcomingClasses(Pageable pageable) {
        return liveClassRepository.findUpcomingClasses(Instant.now(), pageable)
                .map(LiveClassDTO::fromEntity);
    }

    public List<LiveClassDTO> getLiveNow() {
        return liveClassRepository.findLiveNow()
                .stream()
                .map(LiveClassDTO::fromEntity)
                .toList();
    }

    public Page<LiveClassDTO> getClassesByCategory(String categorySlug, Pageable pageable) {
        return liveClassRepository.findByCategorySlug(categorySlug, pageable)
                .map(LiveClassDTO::fromEntity);
    }

    public Page<LiveClassDTO> getClassesByEducator(UUID educatorId, Pageable pageable) {
        return liveClassRepository.findByEducatorId(educatorId, pageable)
                .map(LiveClassDTO::fromEntity);
    }

    public Page<LiveClassDTO> getMyClasses(UUID educatorId, String filter, Pageable pageable) {
        if (filter == null || filter.equalsIgnoreCase("all")) {
            return liveClassRepository.findByEducatorIdOrderByScheduledAtDesc(educatorId, pageable)
                    .map(LiveClassDTO::fromEntity);
        }

        List<LiveClass.ClassStatus> statuses = switch (filter.toLowerCase()) {
            case "upcoming" -> List.of(LiveClass.ClassStatus.SCHEDULED, LiveClass.ClassStatus.LIVE);
            case "past" -> List.of(LiveClass.ClassStatus.COMPLETED);
            case "draft" -> List.of(LiveClass.ClassStatus.DRAFT);
            case "cancelled" -> List.of(LiveClass.ClassStatus.CANCELLED);
            default -> List.of(LiveClass.ClassStatus.values());
        };

        return liveClassRepository.findByEducatorIdAndStatusIn(educatorId, statuses, pageable)
                .map(LiveClassDTO::fromEntity);
    }

    public Page<LiveClassDTO> getMyClassesByEmail(String email, String filter, Pageable pageable) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return getMyClasses(educator.getId(), filter, pageable);
    }

    public Page<LiveClassDTO> getMyClassesWithFilters(UUID educatorId, LiveClassFilter filter, Pageable pageable) {
        return liveClassRepository.findAll(
                LiveClassSpecification.withFilters(educatorId, filter),
                pageable
        ).map(LiveClassDTO::fromEntity);
    }

    public Page<LiveClassDTO> getMyClassesWithFiltersByEmail(String email, LiveClassFilter filter, Pageable pageable) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return getMyClassesWithFilters(educator.getId(), filter, pageable);
    }

    public LiveClassDTO getMyClassByIdAndEmail(UUID classId, String email) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        LiveClass liveClass = liveClassRepository.findByIdWithDetails(classId)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", classId));

        if (!liveClass.getEducator().getId().equals(educator.getId())) {
            throw new BadRequestException("This class does not belong to you");
        }

        return LiveClassDTO.fromEntity(liveClass);
    }

    public LiveClassDTO getClassById(UUID id) {
        return liveClassRepository.findByIdWithDetails(id)
                .map(LiveClassDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", id));
    }

    public Page<LiveClassDTO> searchClasses(String query, Pageable pageable) {
        return liveClassRepository.searchClasses(query, pageable)
                .map(LiveClassDTO::fromEntity);
    }

    @Transactional
    public LiveClassDTO createClass(UUID educatorId, CreateLiveClassRequest request) {
        User educator = userRepository.findById(educatorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", educatorId));

        if (educator.getRole() != User.UserRole.EDUCATOR) {
            throw new BadRequestException("Only educators can create classes");
        }

        // For non-draft classes, scheduledAt is required
        if (!request.isDraft() && request.getScheduledAt() == null) {
            throw new BadRequestException("Scheduled time is required when publishing a class");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        // Set status based on draft flag
        LiveClass.ClassStatus status = request.isDraft()
                ? LiveClass.ClassStatus.DRAFT
                : LiveClass.ClassStatus.SCHEDULED;

        LiveClass liveClass = LiveClass.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .maxStudents(request.getMaxStudents())
                .scheduledAt(request.getScheduledAt())
                .status(status)
                .thumbnailUrl(request.getThumbnailUrl())
                .skillLevel(request.getSkillLevel())
                .topics(request.getTopics() != null ? request.getTopics() : new HashSet<>())
                .requirements(request.getRequirements() != null ? request.getRequirements() : new HashSet<>())
                .educator(educator)
                .category(category)
                .build();

        return LiveClassDTO.fromEntity(liveClassRepository.save(liveClass));
    }

    @Transactional
    public LiveClassDTO updateClass(UUID classId, UUID educatorId, CreateLiveClassRequest request) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", classId));

        if (!liveClass.getEducator().getId().equals(educatorId)) {
            throw new BadRequestException("You can only update your own classes");
        }

        if (liveClass.getStatus() == LiveClass.ClassStatus.LIVE ||
                liveClass.getStatus() == LiveClass.ClassStatus.COMPLETED) {
            throw new BadRequestException("Cannot update a class that is live or completed");
        }

        // For non-draft classes, scheduledAt is required
        if (!request.isDraft() && request.getScheduledAt() == null) {
            throw new BadRequestException("Scheduled time is required when publishing a class");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        // Determine the new status
        // - If currently DRAFT and not saving as draft -> publish to SCHEDULED
        // - If saving as draft -> keep/set as DRAFT
        // - If already SCHEDULED and not saving as draft -> keep SCHEDULED
        LiveClass.ClassStatus newStatus;
        if (request.isDraft()) {
            newStatus = LiveClass.ClassStatus.DRAFT;
        } else if (liveClass.getStatus() == LiveClass.ClassStatus.DRAFT) {
            newStatus = LiveClass.ClassStatus.SCHEDULED; // Publishing a draft
        } else {
            newStatus = liveClass.getStatus(); // Keep current status
        }

        liveClass.setTitle(request.getTitle());
        liveClass.setDescription(request.getDescription());
        liveClass.setPrice(request.getPrice());
        liveClass.setDurationMinutes(request.getDurationMinutes());
        liveClass.setMaxStudents(request.getMaxStudents());
        liveClass.setScheduledAt(request.getScheduledAt());
        liveClass.setStatus(newStatus);
        liveClass.setThumbnailUrl(request.getThumbnailUrl());
        liveClass.setSkillLevel(request.getSkillLevel());
        liveClass.setTopics(request.getTopics() != null ? request.getTopics() : new HashSet<>());
        liveClass.setRequirements(request.getRequirements() != null ? request.getRequirements() : new HashSet<>());
        liveClass.setCategory(category);

        return LiveClassDTO.fromEntity(liveClassRepository.save(liveClass));
    }

    @Transactional
    public void cancelClass(UUID classId, UUID educatorId) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", classId));

        if (!liveClass.getEducator().getId().equals(educatorId)) {
            throw new BadRequestException("You can only cancel your own classes");
        }

        if (liveClass.getStatus() == LiveClass.ClassStatus.LIVE ||
                liveClass.getStatus() == LiveClass.ClassStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a class that is live or completed");
        }

        liveClass.setStatus(LiveClass.ClassStatus.CANCELLED);
        liveClassRepository.save(liveClass);

        // TODO: Notify enrolled students and process refunds
    }

    @Transactional
    public void startClass(UUID classId, UUID educatorId, String meetingUrl) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", classId));

        if (!liveClass.getEducator().getId().equals(educatorId)) {
            throw new BadRequestException("You can only start your own classes");
        }

        if (liveClass.getStatus() != LiveClass.ClassStatus.SCHEDULED) {
            throw new BadRequestException("Class is not in scheduled state");
        }

        liveClass.setStatus(LiveClass.ClassStatus.LIVE);
        liveClass.setStartedAt(Instant.now());
        liveClass.setMeetingUrl(meetingUrl);
        liveClassRepository.save(liveClass);
    }

    @Transactional
    public void endClass(UUID classId, UUID educatorId, String recordingUrl) {
        LiveClass liveClass = liveClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("LiveClass", "id", classId));

        if (!liveClass.getEducator().getId().equals(educatorId)) {
            throw new BadRequestException("You can only end your own classes");
        }

        if (liveClass.getStatus() != LiveClass.ClassStatus.LIVE) {
            throw new BadRequestException("Class is not currently live");
        }

        liveClass.setStatus(LiveClass.ClassStatus.COMPLETED);
        liveClass.setEndedAt(Instant.now());
        liveClass.setRecordingUrl(recordingUrl);
        liveClassRepository.save(liveClass);

        // TODO: Issue certificates to attendees
    }

    // Email-based methods for Keycloak authentication

    @Transactional
    public LiveClassDTO createClassByEmail(String email, CreateLiveClassRequest request) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return createClass(educator.getId(), request);
    }

    @Transactional
    public LiveClassDTO updateClassByEmail(UUID classId, String email, CreateLiveClassRequest request) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return updateClass(classId, educator.getId(), request);
    }

    @Transactional
    public void cancelClassByEmail(UUID classId, String email) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        cancelClass(classId, educator.getId());
    }

    @Transactional
    public void startClassByEmail(UUID classId, String email, String meetingUrl) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        startClass(classId, educator.getId(), meetingUrl);
    }

    @Transactional
    public void endClassByEmail(UUID classId, String email, String recordingUrl) {
        User educator = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        endClass(classId, educator.getId(), recordingUrl);
    }
}
