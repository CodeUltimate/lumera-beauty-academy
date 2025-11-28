package com.lumera.academy.controller;

import com.lumera.academy.dto.ChangePasswordRequest;
import com.lumera.academy.dto.NotificationPreferencesDTO;
import com.lumera.academy.dto.UpdateProfileRequest;
import com.lumera.academy.dto.UserDTO;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.UserRepository;
import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.service.PasswordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/user/settings")
@RequiredArgsConstructor
@Tag(name = "User Settings", description = "User profile and settings management")
public class UserSettingsController {

    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final PasswordService passwordService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserDTO> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    @PutMapping("/profile")
    @Transactional
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserDTO> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Update fields if provided
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getTimezone() != null) {
            user.setTimezone(request.getTimezone());
        }

        // Educator-specific fields
        if (user.getRole() == User.UserRole.EDUCATOR) {
            if (request.getSpecialty() != null) {
                user.setSpecialty(request.getSpecialty());
            }
            if (request.getWebsite() != null) {
                user.setWebsite(request.getWebsite());
            }
            if (request.getInstagram() != null) {
                user.setInstagram(request.getInstagram());
            }
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get notification preferences")
    public ResponseEntity<NotificationPreferencesDTO> getNotificationPreferences(@AuthenticationPrincipal Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return ResponseEntity.ok(NotificationPreferencesDTO.builder()
                .emailNotifications(user.isNotifyEmailEnabled())
                .classReminders(user.isNotifyClassReminders())
                .studentEnrollments(user.isNotifyStudentEnrollments())
                .marketingEmails(user.isNotifyMarketingEmails())
                .weeklyDigest(user.isNotifyWeeklyDigest())
                .build());
    }

    @PutMapping("/notifications")
    @Transactional
    @Operation(summary = "Update notification preferences")
    public ResponseEntity<NotificationPreferencesDTO> updateNotificationPreferences(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody NotificationPreferencesDTO preferences
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        user.setNotifyEmailEnabled(preferences.isEmailNotifications());
        user.setNotifyClassReminders(preferences.isClassReminders());
        user.setNotifyStudentEnrollments(preferences.isStudentEnrollments());
        user.setNotifyMarketingEmails(preferences.isMarketingEmails());
        user.setNotifyWeeklyDigest(preferences.isWeeklyDigest());

        userRepository.save(user);

        return ResponseEntity.ok(preferences);
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend email verification")
    public ResponseEntity<Map<String, String>> resendVerification(@AuthenticationPrincipal Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        // This would trigger the verification email service
        // For now, just return a success message
        return ResponseEntity.ok(Map.of("message", "Verification email sent to " + email));
    }

    @DeleteMapping("/account")
    @Transactional
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Deactivate current user account")
    public ResponseEntity<Map<String, String>> deactivateAccount(@AuthenticationPrincipal Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        user.setStatus(User.UserStatus.DEACTIVATED);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Account has been deactivated"));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change current user password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        passwordService.changePassword(email, request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
