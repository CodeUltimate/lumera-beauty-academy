package com.lumera.academy.security;

import com.lumera.academy.config.AuthCookieProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class AuthCookieService {

    private final AuthCookieProperties properties;

    public ResponseCookie buildAccessTokenCookie(String token, long tokenTtlSeconds) {
        long maxAge = tokenTtlSeconds > 0 ? tokenTtlSeconds : properties.getAccessMaxAgeSeconds();
        return baseCookie(properties.getAccessName(), token, maxAge);
    }

    public ResponseCookie buildRefreshTokenCookie(String token) {
        return baseCookie(properties.getRefreshName(), token, properties.getRefreshMaxAgeSeconds());
    }

    public ResponseCookie clearAccessTokenCookie() {
        return baseCookie(properties.getAccessName(), "", 0);
    }

    public ResponseCookie clearRefreshTokenCookie() {
        return baseCookie(properties.getRefreshName(), "", 0);
    }

    private ResponseCookie baseCookie(String name, String value, long maxAgeSeconds) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(properties.isSecure())
                .sameSite(properties.getSameSite())
                .path(properties.getPath())
                .maxAge(Duration.ofSeconds(maxAgeSeconds));

        if (properties.getDomain() != null && !properties.getDomain().isBlank()) {
            builder.domain(properties.getDomain());
        }
        return builder.build();
    }
}
