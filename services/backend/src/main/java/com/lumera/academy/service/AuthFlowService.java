package com.lumera.academy.service;

import com.lumera.academy.config.KeycloakConfig;
import com.lumera.academy.dto.auth.AuthResponse;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.security.PkceStateStore;
import com.lumera.academy.security.PkceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthFlowService {

    private final KeycloakConfig keycloakConfig;
    private final KeycloakAuthService keycloakAuthService;
    private final PkceStateStore pkceStateStore;
    private final UserSyncService userSyncService;

    public URI buildAuthorizationRedirect(String redirectAfterLogin) {
        String codeVerifier = PkceUtil.generateCodeVerifier();
        String codeChallenge = PkceUtil.generateCodeChallenge(codeVerifier);
        PkceStateStore.StateData stateData = pkceStateStore.save(redirectAfterLogin, codeVerifier);

        // Use frontend client ID for browser-based authorization flow
        String clientId = keycloakConfig.getFrontendClientId() != null
                ? keycloakConfig.getFrontendClientId()
                : keycloakConfig.getClientId();

        URI authorizeUrl = UriComponentsBuilder.fromHttpUrl(keycloakConfig.getAuthorizeUrl())
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", keycloakConfig.getRedirectUri())
                .queryParam("scope", "openid")
                .queryParam("state", stateData.state())
                .queryParam("code_challenge", codeChallenge)
                .queryParam("code_challenge_method", "S256")
                .build()
                .encode()
                .toUri();

        return authorizeUrl;
    }

    public CallbackResult handleCallback(String code, String state) {
        PkceStateStore.StateData stateData = pkceStateStore.consume(state)
                .orElseThrow(() -> new BadRequestException("Invalid or expired state parameter"));

        Map<String, Object> tokenResponse = keycloakAuthService.exchangeAuthorizationCode(
                code,
                stateData.codeVerifier(),
                keycloakConfig.getRedirectUri()
        );

        Map<String, Object> userInfo = keycloakAuthService.getUserInfo((String) tokenResponse.get("access_token"));
        User.UserRole role = userSyncService.extractRole(userInfo);
        UUID userId = userSyncService.syncUser(userInfo, role).getId();

        AuthResponse authResponse = keycloakAuthService.buildAuthResponse(tokenResponse, userInfo, userId);
        return new CallbackResult(authResponse, stateData.redirectUri());
    }

    public record CallbackResult(AuthResponse authResponse, String redirectUri) {
    }
}
