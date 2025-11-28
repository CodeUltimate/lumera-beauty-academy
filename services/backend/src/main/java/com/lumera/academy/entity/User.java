package com.lumera.academy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    private boolean emailVerified;

    private String timezone;

    // Notification preferences
    @Builder.Default
    private boolean notifyEmailEnabled = true;

    @Builder.Default
    private boolean notifyClassReminders = true;

    @Builder.Default
    private boolean notifyStudentEnrollments = true;

    @Builder.Default
    private boolean notifyMarketingEmails = false;

    @Builder.Default
    private boolean notifyWeeklyDigest = true;

    // Educator-specific fields
    private String specialty;
    private String website;
    private String instagram;
    private boolean educatorVerified;

    @OneToMany(mappedBy = "educator", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<LiveClass> taughtClasses = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Enrollment> enrollments = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Certificate> certificates = new HashSet<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public enum UserRole {
        STUDENT, EDUCATOR, ADMIN
    }

    public enum UserStatus {
        ACTIVE, SUSPENDED, PENDING_VERIFICATION, DEACTIVATED
    }
}
