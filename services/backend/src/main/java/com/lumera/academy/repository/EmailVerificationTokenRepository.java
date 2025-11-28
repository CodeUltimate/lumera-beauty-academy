package com.lumera.academy.repository;

import com.lumera.academy.entity.EmailVerificationToken;
import com.lumera.academy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {

    Optional<EmailVerificationToken> findByToken(String token);

    Optional<EmailVerificationToken> findByUserAndUsedAtIsNull(User user);

    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.expiresAt < :now")
    void deleteExpiredTokens(Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM EmailVerificationToken t WHERE t.user = :user")
    void deleteByUser(User user);
}
