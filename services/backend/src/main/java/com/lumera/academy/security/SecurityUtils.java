package com.lumera.academy.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils {

    public Optional<String> getCurrentUserEmail() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .filter(principal -> principal instanceof Jwt)
                .map(principal -> (Jwt) principal)
                .map(jwt -> jwt.getClaimAsString("email"));
    }

    public Optional<String> getCurrentUserSubject() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .filter(principal -> principal instanceof Jwt)
                .map(principal -> (Jwt) principal)
                .map(Jwt::getSubject);
    }

    public String getEmailFromJwt(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email != null) {
            return email;
        }
        return jwt.getClaimAsString("preferred_username");
    }

    public String getFirstNameFromJwt(Jwt jwt) {
        return jwt.getClaimAsString("given_name");
    }

    public String getLastNameFromJwt(Jwt jwt) {
        return jwt.getClaimAsString("family_name");
    }

    public String getSubjectFromJwt(Jwt jwt) {
        return jwt.getSubject();
    }
}
