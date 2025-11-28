package com.lumera.academy.repository;

import com.lumera.academy.entity.Certificate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    Page<Certificate> findByUserId(UUID userId, Pageable pageable);

    Page<Certificate> findByUserIdAndRevokedFalse(UUID userId, Pageable pageable);

    boolean existsByUserIdAndLiveClassId(UUID userId, UUID liveClassId);

    Optional<Certificate> findByUserIdAndLiveClassId(UUID userId, UUID liveClassId);

    long countByUserId(UUID userId);

    long countByUserIdAndRevokedFalse(UUID userId);

    // Educator queries - count certificates issued for educator's classes
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.liveClass.educator.id = :educatorId AND c.revoked = false")
    long countByEducatorId(@Param("educatorId") UUID educatorId);

    @Query("SELECT c FROM Certificate c WHERE c.liveClass.educator.id = :educatorId AND c.revoked = false ORDER BY c.issuedAt DESC")
    Page<Certificate> findByEducatorId(@Param("educatorId") UUID educatorId, Pageable pageable);

    @Query("SELECT c FROM Certificate c WHERE c.liveClass.educator.id = :educatorId AND c.revoked = false ORDER BY c.issuedAt DESC")
    List<Certificate> findAllByEducatorId(@Param("educatorId") UUID educatorId);
}
