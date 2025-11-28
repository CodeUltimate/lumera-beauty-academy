package com.lumera.academy.security;

import com.lumera.academy.config.AuthCookieProperties;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CookieBearerTokenResolver implements BearerTokenResolver {

    private final DefaultBearerTokenResolver delegate = new DefaultBearerTokenResolver();
    private final AuthCookieProperties properties;

    @Override
    public String resolve(HttpServletRequest request) {
        // Prefer standard header if present
        String headerToken = delegate.resolve(request);
        if (headerToken != null) {
            return headerToken;
        }

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (properties.getAccessName().equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
