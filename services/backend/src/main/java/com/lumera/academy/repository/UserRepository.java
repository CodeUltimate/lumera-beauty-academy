package com.lumera.academy.repository;

import com.lumera.academy.entity.User;
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
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(User.UserRole role, Pageable pageable);

    Page<User> findByRoleAndStatus(User.UserRole role, User.UserStatus status, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EDUCATOR' AND u.educatorVerified = true AND u.status = 'ACTIVE'")
    Page<User> findVerifiedEducators(Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = 'EDUCATOR' AND u.educatorVerified = true AND u.status = 'ACTIVE' " +
           "AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.specialty) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchEducators(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = 'EDUCATOR' AND u.educatorVerified = false AND u.status = 'PENDING_VERIFICATION'")
    List<User> findPendingEducatorVerifications();
}
