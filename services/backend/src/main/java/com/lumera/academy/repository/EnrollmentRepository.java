package com.lumera.academy.repository;

import com.lumera.academy.entity.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {

    Optional<Enrollment> findByStudentIdAndLiveClassId(UUID studentId, UUID liveClassId);

    boolean existsByStudentIdAndLiveClassId(UUID studentId, UUID liveClassId);

    Page<Enrollment> findByStudentId(UUID studentId, Pageable pageable);

    Page<Enrollment> findByStudentIdAndStatus(UUID studentId, Enrollment.EnrollmentStatus status, Pageable pageable);

    List<Enrollment> findByLiveClassId(UUID liveClassId);

    @Query("SELECT e FROM Enrollment e WHERE e.liveClass.educator.id = :educatorId")
    Page<Enrollment> findByEducatorId(@Param("educatorId") UUID educatorId, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.liveClass.id = :liveClassId AND e.status NOT IN ('CANCELLED', 'REFUNDED')")
    int countActiveEnrollments(@Param("liveClassId") UUID liveClassId);

    @Query("SELECT SUM(e.educatorEarning) FROM Enrollment e WHERE e.liveClass.educator.id = :educatorId AND e.paymentStatus = 'COMPLETED'")
    BigDecimal calculateTotalEarnings(@Param("educatorId") UUID educatorId);

    @Query("SELECT SUM(e.educatorEarning) FROM Enrollment e WHERE e.liveClass.educator.id = :educatorId AND e.paymentStatus = 'COMPLETED' AND e.createdAt >= :since")
    BigDecimal calculateEarningsSince(@Param("educatorId") UUID educatorId, @Param("since") Instant since);

    @Query("SELECT DISTINCT e.student FROM Enrollment e WHERE e.liveClass.educator.id = :educatorId")
    Page<com.lumera.academy.entity.User> findStudentsByEducator(@Param("educatorId") UUID educatorId, Pageable pageable);

    @Query("SELECT COUNT(DISTINCT e.student.id) FROM Enrollment e WHERE e.liveClass.educator.id = :educatorId")
    long countDistinctStudentsByEducator(@Param("educatorId") UUID educatorId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId AND e.liveClass.educator.id = :educatorId AND e.status NOT IN ('CANCELLED', 'REFUNDED')")
    long countEnrollmentsByStudentAndEducator(@Param("studentId") UUID studentId, @Param("educatorId") UUID educatorId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.student.id = :studentId AND e.liveClass.educator.id = :educatorId AND e.status = 'COMPLETED'")
    long countCompletedByStudentAndEducator(@Param("studentId") UUID studentId, @Param("educatorId") UUID educatorId);

    @Query("SELECT MIN(e.enrolledAt) FROM Enrollment e WHERE e.student.id = :studentId AND e.liveClass.educator.id = :educatorId")
    Instant findFirstEnrollmentDate(@Param("studentId") UUID studentId, @Param("educatorId") UUID educatorId);

    @Query("SELECT DISTINCT e.student FROM Enrollment e WHERE e.liveClass.educator.id = :educatorId AND " +
           "(LOWER(e.student.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.student.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.student.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<com.lumera.academy.entity.User> findStudentsByEducatorWithSearch(
        @Param("educatorId") UUID educatorId,
        @Param("search") String search,
        Pageable pageable);
}
