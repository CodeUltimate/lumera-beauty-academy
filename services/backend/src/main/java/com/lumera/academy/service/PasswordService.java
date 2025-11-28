package com.lumera.academy.service;

import com.lumera.academy.config.KeycloakConfig;
import com.lumera.academy.dto.ChangePasswordRequest;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordService {

    private final KeycloakConfig keycloakConfig;
    private final WebClient.Builder webClientBuilder;

    /**
     * Change the user's password
     */
    public void changePassword(String email, ChangePasswordRequest request) {
        // Validate passwords match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirmation do not match");
        }

        // Validate new password is different from current
        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        // Verify current password by attempting to authenticate
        if (!verifyCurrentPassword(email, request.getCurrentPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Get admin token and update password
        try {
            String adminToken = getAdminToken();
            String userId = getKeycloakUserId(adminToken, email);
            updatePassword(adminToken, userId, request.getNewPassword());
            log.info("Password changed successfully for user: {}", email);
        } catch (WebClientResponseException e) {
            log.error("Failed to change password in Keycloak: {}", e.getResponseBodyAsString());
            throw new BadRequestException("Failed to change password. Please try again.");
        }
    }

    /**
     * Verify the current password by attempting to authenticate with Keycloak
     */
    private boolean verifyCurrentPassword(String email, String password) {
        try {
            // Try to authenticate with the user's credentials using the frontend client (public client)
            String body = "grant_type=password" +
                    "&client_id=" + keycloakConfig.getFrontendClientId() +
                    "&username=" + URLEncoder.encode(email, StandardCharsets.UTF_8) +
                    "&password=" + URLEncoder.encode(password, StandardCharsets.UTF_8);

            webClientBuilder.build()
                    .post()
                    .uri(keycloakConfig.getTokenUrl())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return true;
        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 400) {
                return false;
            }
            log.error("Error verifying password: {}", e.getResponseBodyAsString());
            throw new BadRequestException("Failed to verify current password");
        }
    }

    private String getAdminToken() {
        Map<?, ?> response = webClientBuilder.build()
                .post()
                .uri(keycloakConfig.getTokenUrl())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue("grant_type=client_credentials&client_id=" + keycloakConfig.getClientId()
                        + "&client_secret=" + keycloakConfig.getClientSecret())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response != null ? (String) response.get("access_token") : null;
    }

    private String getKeycloakUserId(String adminToken, String email) {
        List<?> users = webClientBuilder.build()
                .get()
                .uri(keycloakConfig.getAdminUrl() + "/users?email=" + URLEncoder.encode(email, StandardCharsets.UTF_8) + "&exact=true")
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .bodyToMono(List.class)
                .block();

        if (users == null || users.isEmpty()) {
            throw new ResourceNotFoundException("User", "email", email);
        }

        Map<?, ?> user = (Map<?, ?>) users.get(0);
        return (String) user.get("id");
    }

    private void updatePassword(String adminToken, String userId, String newPassword) {
        Map<String, Object> credentialData = Map.of(
                "type", "password",
                "value", newPassword,
                "temporary", false
        );

        webClientBuilder.build()
                .put()
                .uri(keycloakConfig.getAdminUrl() + "/users/" + userId + "/reset-password")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(credentialData)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
