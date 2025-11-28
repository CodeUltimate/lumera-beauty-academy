package com.lumera.academy.service;

import com.lumera.academy.dto.StudentSummaryDTO;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.EnrollmentRepository;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<StudentSummaryDTO> getStudentsByEducator(UUID educatorId, String search, Pageable pageable) {
        Page<User> students;

        if (search != null && !search.isBlank()) {
            students = enrollmentRepository.findStudentsByEducatorWithSearch(educatorId, search, pageable);
        } else {
            students = enrollmentRepository.findStudentsByEducator(educatorId, pageable);
        }

        return students.map(student -> toStudentSummary(student, educatorId));
    }

    @Transactional(readOnly = true)
    public Page<StudentSummaryDTO> getStudentsByEducatorEmail(String email, String search, Pageable pageable) {
        User educator = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return getStudentsByEducator(educator.getId(), search, pageable);
    }

    @Transactional(readOnly = true)
    public long countStudentsByEducator(UUID educatorId) {
        return enrollmentRepository.countDistinctStudentsByEducator(educatorId);
    }

    @Transactional(readOnly = true)
    public long countStudentsByEducatorEmail(String email) {
        User educator = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return countStudentsByEducator(educator.getId());
    }

    private StudentSummaryDTO toStudentSummary(User student, UUID educatorId) {
        long enrolledCount = enrollmentRepository.countEnrollmentsByStudentAndEducator(student.getId(), educatorId);
        long completedCount = enrollmentRepository.countCompletedByStudentAndEducator(student.getId(), educatorId);
        var firstEnrolledAt = enrollmentRepository.findFirstEnrollmentDate(student.getId(), educatorId);

        return StudentSummaryDTO.builder()
            .id(student.getId())
            .name(student.getFullName())
            .email(student.getEmail())
            .avatarUrl(student.getAvatarUrl())
            .enrolledClasses(enrolledCount)
            .completedClasses(completedCount)
            .firstEnrolledAt(firstEnrolledAt)
            .build();
    }
}
