package com.lumera.academy.service;

import com.lumera.academy.entity.User;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserSyncService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User syncUser(Map<String, Object> userInfo, User.UserRole role) {
        String email = (String) userInfo.get("email");
        String computedFirstName = (String) userInfo.getOrDefault("given_name", "");
        String computedLastName = (String) userInfo.getOrDefault("family_name", "");
        if (computedFirstName.isBlank() && userInfo.get("name") != null) {
            String[] parts = userInfo.get("name").toString().split(" ", 2);
            computedFirstName = parts[0];
            if (parts.length > 1) {
                computedLastName = parts[1];
            }
        }
        final String firstName = computedFirstName;
        final String lastName = computedLastName;
        Boolean emailVerified = (Boolean) userInfo.getOrDefault("email_verified", Boolean.FALSE);

        return userRepository.findByEmail(email)
                .map(existing -> updateExisting(existing, firstName, lastName, role, emailVerified))
                .orElseGet(() -> createUser(email, firstName, lastName, role, emailVerified));
    }

    private User updateExisting(User user, String firstName, String lastName, User.UserRole role, boolean emailVerified) {
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setEmailVerified(emailVerified);
        return userRepository.save(user);
    }

    private User createUser(String email, String firstName, String lastName, User.UserRole role, boolean emailVerified) {
        String placeholderPassword = passwordEncoder.encode("external-auth-" + email);

        User.UserStatus status = User.UserStatus.ACTIVE;
        if (role == User.UserRole.EDUCATOR && !emailVerified) {
            status = User.UserStatus.PENDING_VERIFICATION;
        }

        User user = User.builder()
                .firstName(firstName.isBlank() ? "User" : firstName)
                .lastName(lastName.isBlank() ? "Keycloak" : lastName)
                .email(email)
                .passwordHash(placeholderPassword)
                .role(role)
                .status(status)
                .emailVerified(emailVerified)
                .timezone("UTC")
                .educatorVerified(false)
                .build();

        return userRepository.save(user);
    }

    @SuppressWarnings("unchecked")
    public User.UserRole extractRole(Map<String, Object> userInfo) {
        List<String> roles = (List<String>) userInfo.get("roles");
        if (roles != null) {
            for (String r : roles) {
                try {
                    return User.UserRole.valueOf(r.toUpperCase());
                } catch (IllegalArgumentException ignored) {
                }
            }
        }
        return User.UserRole.STUDENT;
    }
}
