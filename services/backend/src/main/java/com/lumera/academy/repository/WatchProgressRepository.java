package com.lumera.academy.repository;

import com.lumera.academy.entity.WatchProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WatchProgressRepository extends JpaRepository<WatchProgress, UUID> {

    Optional<WatchProgress> findByUserIdAndLiveClassId(UUID userId, UUID liveClassId);

    List<WatchProgress> findByUserId(UUID userId);

    List<WatchProgress> findByUserIdAndCompletedTrue(UUID userId);

    boolean existsByUserIdAndLiveClassIdAndCompletedTrue(UUID userId, UUID liveClassId);

    long countByUserIdAndCompletedTrue(UUID userId);

    @Query("SELECT wp FROM WatchProgress wp WHERE wp.liveClass.educator.id = :educatorId AND wp.completed = true")
    List<WatchProgress> findCompletedByEducatorId(@Param("educatorId") UUID educatorId);

    @Query("SELECT COUNT(wp) FROM WatchProgress wp WHERE wp.liveClass.educator.id = :educatorId AND wp.completed = true")
    long countCompletedByEducatorId(@Param("educatorId") UUID educatorId);
}
