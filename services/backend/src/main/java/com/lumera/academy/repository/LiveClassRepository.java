package com.lumera.academy.repository;

import com.lumera.academy.entity.LiveClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface LiveClassRepository extends JpaRepository<LiveClass, UUID>, JpaSpecificationExecutor<LiveClass> {

    Page<LiveClass> findByEducatorId(UUID educatorId, Pageable pageable);

    Page<LiveClass> findByEducatorIdAndStatus(UUID educatorId, LiveClass.ClassStatus status, Pageable pageable);

    Page<LiveClass> findByCategoryId(UUID categoryId, Pageable pageable);

    Page<LiveClass> findByCategorySlug(String categorySlug, Pageable pageable);

    @Query("SELECT lc FROM LiveClass lc WHERE lc.status = 'SCHEDULED' AND lc.scheduledAt > :now ORDER BY lc.scheduledAt ASC")
    Page<LiveClass> findUpcomingClasses(@Param("now") Instant now, Pageable pageable);

    @Query("SELECT lc FROM LiveClass lc WHERE lc.status = 'LIVE'")
    List<LiveClass> findLiveNow();

    @Query("SELECT lc FROM LiveClass lc WHERE lc.category.id = :categoryId AND lc.status = 'SCHEDULED' AND lc.scheduledAt > :now ORDER BY lc.scheduledAt ASC")
    Page<LiveClass> findUpcomingByCategory(@Param("categoryId") UUID categoryId, @Param("now") Instant now, Pageable pageable);

    @Query("SELECT lc FROM LiveClass lc WHERE lc.educator.id = :educatorId AND lc.status = 'SCHEDULED' AND lc.scheduledAt > :now ORDER BY lc.scheduledAt ASC")
    List<LiveClass> findUpcomingByEducator(@Param("educatorId") UUID educatorId, @Param("now") Instant now);

    @Query("SELECT lc FROM LiveClass lc WHERE lc.status = 'SCHEDULED' AND lc.scheduledAt BETWEEN :start AND :end")
    List<LiveClass> findClassesInTimeRange(@Param("start") Instant start, @Param("end") Instant end);

    @Query("SELECT lc FROM LiveClass lc WHERE " +
           "(LOWER(lc.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(lc.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND lc.status IN ('SCHEDULED', 'LIVE')")
    Page<LiveClass> searchClasses(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(lc) FROM LiveClass lc WHERE lc.educator.id = :educatorId AND lc.status = :status")
    long countByEducatorAndStatus(@Param("educatorId") UUID educatorId, @Param("status") LiveClass.ClassStatus status);

    @Query(value = "SELECT lc FROM LiveClass lc JOIN FETCH lc.educator JOIN FETCH lc.category WHERE lc.educator.id = :educatorId AND lc.status IN :statuses ORDER BY lc.scheduledAt DESC NULLS LAST",
           countQuery = "SELECT COUNT(lc) FROM LiveClass lc WHERE lc.educator.id = :educatorId AND lc.status IN :statuses")
    Page<LiveClass> findByEducatorIdAndStatusIn(
        @Param("educatorId") UUID educatorId,
        @Param("statuses") List<LiveClass.ClassStatus> statuses,
        Pageable pageable
    );

    @Query(value = "SELECT lc FROM LiveClass lc JOIN FETCH lc.educator JOIN FETCH lc.category WHERE lc.educator.id = :educatorId ORDER BY lc.scheduledAt DESC NULLS LAST",
           countQuery = "SELECT COUNT(lc) FROM LiveClass lc WHERE lc.educator.id = :educatorId")
    Page<LiveClass> findByEducatorIdOrderByScheduledAtDesc(@Param("educatorId") UUID educatorId, Pageable pageable);

    @Query("SELECT lc FROM LiveClass lc JOIN FETCH lc.educator JOIN FETCH lc.category WHERE lc.id = :id")
    java.util.Optional<LiveClass> findByIdWithDetails(@Param("id") UUID id);
}
