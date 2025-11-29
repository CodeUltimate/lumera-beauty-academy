package com.lumera.academy.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "keycloak")
@ConditionalOnProperty(name = "app.auth.enabled", havingValue = "true", matchIfMissing = false)
@Getter
@Setter
public class KeycloakConfig {

    private String url;
    private String externalUrl;
    private String realm;
    private String clientId;
    private String clientSecret;
    private String frontendClientId;
    private String redirectUri;
    private String postLogoutRedirectUri;

    /**
     * Get external URL for browser redirects (falls back to url if not set)
     */
    public String getExternalUrl() {
        return externalUrl != null && !externalUrl.isBlank() ? externalUrl : url;
    }

    public String getTokenUrl() {
        return url + "/realms/" + realm + "/protocol/openid-connect/token";
    }

    public String getUserInfoUrl() {
        return url + "/realms/" + realm + "/protocol/openid-connect/userinfo";
    }

    public String getLogoutUrl() {
        return url + "/realms/" + realm + "/protocol/openid-connect/logout";
    }

    public String getAdminUrl() {
        return url + "/admin/realms/" + realm;
    }

    public String getAuthorizeUrl() {
        return getExternalUrl() + "/realms/" + realm + "/protocol/openid-connect/auth";
    }

    public String getEndSessionUrl() {
        return url + "/realms/" + realm + "/protocol/openid-connect/logout";
    }
}
