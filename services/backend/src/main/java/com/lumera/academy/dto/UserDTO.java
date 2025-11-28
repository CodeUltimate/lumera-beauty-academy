package com.lumera.academy.dto;

import com.lumera.academy.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class UserDTO {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String bio;
    private String avatarUrl;
    private User.UserRole role;
    private User.UserStatus status;
    private boolean emailVerified;
    private String timezone;

    // Educator-specific
    private String specialty;
    private String website;
    private String instagram;
    private boolean educatorVerified;

    private Instant createdAt;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .bio(user.getBio())
            .avatarUrl(user.getAvatarUrl())
            .role(user.getRole())
            .status(user.getStatus())
            .emailVerified(user.isEmailVerified())
            .timezone(user.getTimezone())
            .specialty(user.getSpecialty())
            .website(user.getWebsite())
            .instagram(user.getInstagram())
            .educatorVerified(user.isEducatorVerified())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
