package com.lumera.academy.service;

import com.lumera.academy.entity.EmailVerificationToken;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.EmailVerificationTokenRepository;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private static final int TOKEN_EXPIRY_HOURS = 24;

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public void sendVerificationEmail(User user) {
        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);

        // Create new token
        EmailVerificationToken token = EmailVerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(Instant.now().plus(TOKEN_EXPIRY_HOURS, ChronoUnit.HOURS))
                .build();

        token = tokenRepository.save(token);

        // Send email asynchronously
        emailService.sendVerificationEmail(user, token.getToken());
        log.info("Verification email initiated for user: {}", user.getEmail());
    }

    @Transactional
    public User verifyEmail(String token) {
        EmailVerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.isExpired()) {
            throw new BadRequestException("Verification token has expired. Please request a new one.");
        }

        if (verificationToken.isUsed()) {
            throw new BadRequestException("This verification link has already been used.");
        }

        // Mark token as used
        verificationToken.setUsedAt(Instant.now());
        tokenRepository.save(verificationToken);

        // Update user
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        if (user.getStatus() == User.UserStatus.PENDING_VERIFICATION) {
            user.setStatus(User.UserStatus.ACTIVE);
        }
        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(user);

        log.info("Email verified successfully for user: {}", user.getEmail());
        return user;
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified.");
        }

        sendVerificationEmail(user);
    }
}
