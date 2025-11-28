package com.lumera.academy.controller;

import com.lumera.academy.dto.auth.*;
import com.lumera.academy.config.AuthCookieProperties;
import com.lumera.academy.entity.User;
import com.lumera.academy.security.AuthCookieService;
import com.lumera.academy.service.KeycloakAuthService;
import com.lumera.academy.service.AuthFlowService;
import com.lumera.academy.service.EmailVerificationService;
import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.dto.UserDTO;
import com.lumera.academy.repository.UserRepository;
import com.lumera.academy.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.net.URI;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints via Keycloak")
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final KeycloakAuthService keycloakAuthService;
    private final AuthCookieService authCookieService;
    private final AuthFlowService authFlowService;
    private final EmailVerificationService emailVerificationService;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final AuthCookieProperties authCookieProperties;

    @PostMapping("/register")
    @Operation(summary = "Register a new user in Keycloak")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for email: {}, role: {}", request.getEmail(), request.getRole());

        // Register user in Keycloak
        keycloakAuthService.registerUser(request);
        log.info("User registered in Keycloak: {}", request.getEmail());

        // Auto-login after registration
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(request.getEmail());
        loginRequest.setPassword(request.getPassword());

        AuthResponse response = keycloakAuthService.login(loginRequest);
        ResponseCookie accessCookie = authCookieService.buildAccessTokenCookie(response.getAccessToken(), response.getExpiresIn());
        ResponseCookie refreshCookie = authCookieService.buildRefreshTokenCookie(response.getRefreshToken());
        log.info("Auto-login completed for: {}", request.getEmail());

        // Send verification email for educators
        if (request.getRole() == User.UserRole.EDUCATOR) {
            log.info("User is EDUCATOR, attempting to send verification email to: {}", request.getEmail());
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isPresent()) {
                log.info("User found in database, sending verification email to: {}", request.getEmail());
                emailVerificationService.sendVerificationEmail(userOpt.get());
                log.info("Verification email initiated for: {}", request.getEmail());
            } else {
                log.warn("User NOT found in database after registration: {}", request.getEmail());
            }
        } else {
            log.info("User role is {}, skipping verification email", request.getRole());
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(
            @RequestBody(required = false) TokenRefreshRequest request,
            HttpServletRequest servletRequest
    ) {
        String refreshToken = request != null ? request.getRefreshToken() : null;
        if (refreshToken == null || refreshToken.isBlank()) {
            refreshToken = extractCookie(servletRequest, authCookieProperties.getRefreshName()).orElse(null);
        }
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new com.lumera.academy.exception.BadRequestException("Refresh token is required");
        }

        TokenRefreshRequest effectiveRequest = new TokenRefreshRequest();
        effectiveRequest.setRefreshToken(refreshToken);

        AuthResponse response = keycloakAuthService.refreshToken(effectiveRequest);
        ResponseCookie accessCookie = authCookieService.buildAccessTokenCookie(response.getAccessToken(), response.getExpiresIn());
        ResponseCookie refreshCookie = authCookieService.buildRefreshTokenCookie(response.getRefreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout and invalidate refresh token")
    public ResponseEntity<Map<String, String>> logout(@RequestBody(required = false) LogoutRequest request, HttpServletRequest servletRequest) {
        String refreshToken = request != null ? request.getRefreshToken() : null;
        if (refreshToken == null || refreshToken.isBlank()) {
            refreshToken = extractCookie(servletRequest, authCookieProperties.getRefreshName()).orElse(null);
        }
        if (refreshToken != null && !refreshToken.isBlank()) {
            keycloakAuthService.logout(refreshToken);
        }
        ResponseCookie clearAccess = authCookieService.clearAccessTokenCookie();
        ResponseCookie clearRefresh = authCookieService.clearRefreshTokenCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearAccess.toString(), clearRefresh.toString())
                .body(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/login")
    @Operation(summary = "Redirect to Keycloak for login (Authorization Code + PKCE)")
    public ResponseEntity<Void> loginRedirect(@RequestParam(defaultValue = "/") String redirect) {
        URI location = authFlowService.buildAuthorizationRedirect(redirect);
        return ResponseEntity.status(HttpStatus.FOUND).location(location).build();
    }

    @GetMapping("/callback")
    @Operation(summary = "Handle Keycloak OAuth2 callback")
    public ResponseEntity<Void> callback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error,
            @RequestParam(required = false, name = "error_description") String errorDescription,
            @RequestParam(required = false, defaultValue = "/login") String redirect
    ) {
        // Handle error response from Keycloak (e.g., user cancelled login)
        if (error != null) {
            String loginUrl = "http://localhost:3000/login?error=" + error;
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(loginUrl))
                    .build();
        }

        // Validate required parameters for successful callback
        if (code == null || state == null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("http://localhost:3000/login?error=invalid_callback"))
                    .build();
        }

        AuthFlowService.CallbackResult result = authFlowService.handleCallback(code, state);
        ResponseCookie accessCookie = authCookieService.buildAccessTokenCookie(result.authResponse().getAccessToken(), result.authResponse().getExpiresIn());
        ResponseCookie refreshCookie = authCookieService.buildRefreshTokenCookie(result.authResponse().getRefreshToken());

        String redirectTarget = result.redirectUri() != null && !result.redirectUri().isBlank()
                ? result.redirectUri()
                : redirect;

        // Ensure redirect target is a full URL for the frontend
        if (!redirectTarget.startsWith("http")) {
            redirectTarget = "http://localhost:3000" + redirectTarget;
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString(), refreshCookie.toString())
                .location(URI.create(redirectTarget))
                .build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserDTO> me() {
        String email = securityUtils.getCurrentUserEmail()
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", "unknown"));

        return userRepository.findByEmail(email)
                .map(UserDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private Optional<String> extractCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return Optional.ofNullable(cookie.getValue());
            }
        }
        return Optional.empty();
    }
}
