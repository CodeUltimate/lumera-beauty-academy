package com.lumera.academy.dto.auth;

import com.lumera.academy.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private UUID id;
        private String email;
        private String firstName;
        private String lastName;
        private User.UserRole role;
        private String avatarUrl;
    }
}
