package com.lumera.academy.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.auth.cookie")
@Getter
@Setter
public class AuthCookieProperties {

    /**
     * Name of the HttpOnly access token cookie.
     */
    private String accessName = "lumera_at";

    /**
     * Name of the HttpOnly refresh token cookie.
     */
    private String refreshName = "lumera_rt";

    /**
     * Cookie domain. Leave blank to default to current host.
     */
    private String domain = "";

    private String path = "/";

    private boolean secure = true;

    private String sameSite = "Lax";

    /**
     * Access token cookie max-age in seconds.
     */
    private long accessMaxAgeSeconds = 600;

    /**
     * Refresh token cookie max-age in seconds.
     */
    private long refreshMaxAgeSeconds = 3600;
}
