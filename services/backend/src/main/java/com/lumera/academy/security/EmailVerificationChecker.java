package com.lumera.academy.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component("emailVerifier")
public class EmailVerificationChecker {

    public boolean isVerified(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Boolean verified = jwtAuth.getToken().getClaimAsBoolean("email_verified");
            return Boolean.TRUE.equals(verified);
        }
        return false;
    }
}
