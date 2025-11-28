package com.lumera.academy.service;

import com.lumera.academy.config.KeycloakConfig;
import com.lumera.academy.dto.auth.AuthResponse;
import com.lumera.academy.dto.auth.LoginRequest;
import com.lumera.academy.dto.auth.RegisterRequest;
import com.lumera.academy.dto.auth.TokenRefreshRequest;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakAuthService {

    private final KeycloakConfig keycloakConfig;
    private final WebClient.Builder webClientBuilder;
    private final UserSyncService userSyncService;

    public AuthResponse login(LoginRequest request) {
        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "password");
            formData.add("client_id", keycloakConfig.getClientId());
            formData.add("client_secret", keycloakConfig.getClientSecret());
            formData.add("username", request.getEmail());
            formData.add("password", request.getPassword());
            formData.add("scope", "openid profile email roles");

            Map<String, Object> tokenResponse = webClientBuilder.build()
                    .post()
                    .uri(keycloakConfig.getTokenUrl())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (tokenResponse == null) {
                throw new BadRequestException("Failed to authenticate");
            }

            // Get user info from Keycloak
            Map<String, Object> userInfo = getUserInfo((String) tokenResponse.get("access_token"));
            User.UserRole role = userSyncService.extractRole(userInfo);
            UUID userId = userSyncService.syncUser(userInfo, role).getId();

            return buildAuthResponse(tokenResponse, userInfo, userId);

        } catch (WebClientResponseException e) {
            log.error("Keycloak authentication failed: {}", e.getResponseBodyAsString());
            throw new BadRequestException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(TokenRefreshRequest request) {
        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "refresh_token");
            formData.add("client_id", keycloakConfig.getClientId());
            formData.add("client_secret", keycloakConfig.getClientSecret());
            formData.add("refresh_token", request.getRefreshToken());

            Map<String, Object> tokenResponse = webClientBuilder.build()
                    .post()
                    .uri(keycloakConfig.getTokenUrl())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (tokenResponse == null) {
                throw new BadRequestException("Failed to refresh token");
            }

            Map<String, Object> userInfo = getUserInfo((String) tokenResponse.get("access_token"));
            User.UserRole role = userSyncService.extractRole(userInfo);
            UUID userId = userSyncService.syncUser(userInfo, role).getId();

            return buildAuthResponse(tokenResponse, userInfo, userId);

        } catch (WebClientResponseException e) {
            log.error("Token refresh failed: {}", e.getResponseBodyAsString());
            throw new BadRequestException("Invalid or expired refresh token");
        }
    }

    public void logout(String refreshToken) {
        // Try with backend client first (for tokens issued via direct login)
        if (tryLogout(refreshToken, keycloakConfig.getClientId(), keycloakConfig.getClientSecret())) {
            return;
        }

        // If that fails, try with frontend client (for tokens issued via OAuth2 flow)
        // Frontend client is public, so no secret is needed
        String frontendClientId = keycloakConfig.getFrontendClientId();
        if (frontendClientId != null && !frontendClientId.isBlank()) {
            tryLogout(refreshToken, frontendClientId, null);
        }
    }

    private boolean tryLogout(String refreshToken, String clientId, String clientSecret) {
        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("client_id", clientId);
            if (clientSecret != null && !clientSecret.isBlank()) {
                formData.add("client_secret", clientSecret);
            }
            formData.add("refresh_token", refreshToken);

            webClientBuilder.build()
                    .post()
                    .uri(keycloakConfig.getLogoutUrl())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            log.debug("Logout successful with client: {}", clientId);
            return true;

        } catch (WebClientResponseException e) {
            log.debug("Logout attempt with client {} failed: {}", clientId, e.getResponseBodyAsString());
            return false;
        }
    }

    public String registerUser(RegisterRequest request) {
        // First, get admin token
        String adminToken = getAdminToken();

        // Create user in Keycloak
        Map<String, Object> userRepresentation = Map.of(
                "username", request.getEmail(),
                "email", request.getEmail(),
                "firstName", request.getFirstName(),
                "lastName", request.getLastName(),
                "enabled", true,
                "emailVerified", false,
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", request.getPassword(),
                        "temporary", false
                )),
                "realmRoles", List.of(request.getRole().name()),
                "attributes", buildUserAttributes(request)
        );

        try {
            webClientBuilder.build()
                    .post()
                    .uri(keycloakConfig.getAdminUrl() + "/users")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(userRepresentation)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .block();

            // Get the created user ID
            String userId = getUserIdByEmail(adminToken, request.getEmail());

            // Assign role to user
            assignRoleToUser(adminToken, userId, request.getRole().name());

            return userId;

        } catch (WebClientResponseException e) {
            log.error("Failed to create user in Keycloak: {}", e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 409) {
                throw new BadRequestException("Email already in use");
            }
            throw new BadRequestException("Failed to create user");
        }
    }

    private Map<String, Object> buildUserAttributes(RegisterRequest request) {
        if (request.getRole() == User.UserRole.EDUCATOR) {
            return Map.of(
                    "specialty", List.of(request.getSpecialty() != null ? request.getSpecialty() : ""),
                    "bio", List.of(request.getBio() != null ? request.getBio() : ""),
                    "educatorVerified", List.of("false")
            );
        }
        return Map.of();
    }

    private String getAdminToken() {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");
        formData.add("client_id", keycloakConfig.getClientId());
        formData.add("client_secret", keycloakConfig.getClientSecret());

        Map<String, Object> response = webClientBuilder.build()
                .post()
                .uri(keycloakConfig.getTokenUrl())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return (String) response.get("access_token");
    }

    private String getUserIdByEmail(String adminToken, String email) {
        List<Map<String, Object>> users = webClientBuilder.build()
                .get()
                .uri(keycloakConfig.getAdminUrl() + "/users?email=" + email + "&exact=true")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .bodyToMono(List.class)
                .block();

        if (users == null || users.isEmpty()) {
            throw new BadRequestException("User not found after creation");
        }

        return (String) users.get(0).get("id");
    }

    private void assignRoleToUser(String adminToken, String userId, String roleName) {
        // Get the role
        List<Map<String, Object>> roles = webClientBuilder.build()
                .get()
                .uri(keycloakConfig.getAdminUrl() + "/roles")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .retrieve()
                .bodyToMono(List.class)
                .block();

        Map<String, Object> role = roles.stream()
                .filter(r -> roleName.equals(r.get("name")))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));

        // Assign role to user
        webClientBuilder.build()
                .post()
                .uri(keycloakConfig.getAdminUrl() + "/users/" + userId + "/role-mappings/realm")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(List.of(role))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public Map<String, Object> exchangeAuthorizationCode(String code, String codeVerifier, String redirectUri) {
        // Use frontend client ID for authorization code exchange (public client, no secret)
        String clientId = keycloakConfig.getFrontendClientId() != null
                ? keycloakConfig.getFrontendClientId()
                : keycloakConfig.getClientId();

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("code", code);
        formData.add("code_verifier", codeVerifier);
        formData.add("redirect_uri", redirectUri);
        formData.add("client_id", clientId);
        // No client_secret for public clients (PKCE is used instead)

        Map<String, Object> tokenResponse = webClientBuilder.build()
                .post()
                .uri(keycloakConfig.getTokenUrl())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (tokenResponse == null) {
            throw new BadRequestException("Failed to exchange authorization code");
        }
        return tokenResponse;
    }

    public Map<String, Object> getUserInfo(String accessToken) {
        return webClientBuilder.build()
                .get()
                .uri(keycloakConfig.getUserInfoUrl())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public AuthResponse buildAuthResponse(Map<String, Object> tokenResponse, Map<String, Object> userInfo, UUID userId) {
        // Extract roles from token or userinfo
        @SuppressWarnings("unchecked")
        List<String> roles = userInfo.get("roles") != null
                ? (List<String>) userInfo.get("roles")
                : List.of("STUDENT");

        User.UserRole role = roles.stream()
                .map(r -> {
                    try {
                        return User.UserRole.valueOf(r.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(User.UserRole.STUDENT);

        return AuthResponse.builder()
                .accessToken((String) tokenResponse.get("access_token"))
                .refreshToken((String) tokenResponse.get("refresh_token"))
                .tokenType("Bearer")
                .expiresIn(((Number) tokenResponse.get("expires_in")).longValue())
                .user(AuthResponse.UserInfo.builder()
                        .id(userId)
                        .email((String) userInfo.get("email"))
                        .firstName((String) userInfo.get("given_name"))
                        .lastName((String) userInfo.get("family_name"))
                        .role(role)
                        .avatarUrl(null)
                        .build())
                .build();
    }
}
