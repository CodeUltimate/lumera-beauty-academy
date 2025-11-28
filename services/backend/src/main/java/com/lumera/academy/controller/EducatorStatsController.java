package com.lumera.academy.controller;

import com.lumera.academy.entity.User;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.UserRepository;
import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.service.CertificateService;
import com.lumera.academy.service.WatchProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1/educator/stats")
@PreAuthorize("hasRole('EDUCATOR')")
@RequiredArgsConstructor
@Tag(name = "Educator Stats", description = "Educator dashboard statistics endpoints")
public class EducatorStatsController {

    private final CertificateService certificateService;
    private final WatchProgressService watchProgressService;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @GetMapping("/certificates")
    @Operation(summary = "Get certificate statistics for educator")
    public ResponseEntity<CertificateStatsDTO> getCertificateStats(@AuthenticationPrincipal Jwt jwt) {
        UUID educatorId = getCurrentEducatorId(jwt);
        long certificateCount = certificateService.countEducatorCertificates(educatorId);
        long completionCount = watchProgressService.getEducatorCompletionCount(educatorId);

        return ResponseEntity.ok(CertificateStatsDTO.builder()
                .certificatesIssued(certificateCount)
                .classCompletions(completionCount)
                .build());
    }

    @GetMapping("/overview")
    @Operation(summary = "Get all dashboard statistics for educator")
    public ResponseEntity<EducatorDashboardStatsDTO> getDashboardStats(@AuthenticationPrincipal Jwt jwt) {
        UUID educatorId = getCurrentEducatorId(jwt);

        long certificateCount = certificateService.countEducatorCertificates(educatorId);
        long completionCount = watchProgressService.getEducatorCompletionCount(educatorId);

        return ResponseEntity.ok(EducatorDashboardStatsDTO.builder()
                .certificatesIssued(certificateCount)
                .classCompletions(completionCount)
                .build());
    }

    private UUID getCurrentEducatorId(Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return user.getId();
    }

    @Data
    @Builder
    public static class CertificateStatsDTO {
        private long certificatesIssued;
        private long classCompletions;
    }

    @Data
    @Builder
    public static class EducatorDashboardStatsDTO {
        private long certificatesIssued;
        private long classCompletions;
    }
}
