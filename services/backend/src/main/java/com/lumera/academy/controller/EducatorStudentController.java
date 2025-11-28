package com.lumera.academy.controller;

import com.lumera.academy.dto.StudentSummaryDTO;
import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/educator/students")
@PreAuthorize("hasRole('EDUCATOR')")
@RequiredArgsConstructor
@Tag(name = "Educator Students", description = "Educator student management endpoints")
public class EducatorStudentController {

    private final StudentService studentService;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Get students enrolled in educator's classes")
    public ResponseEntity<Page<StudentSummaryDTO>> getMyStudents(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        String email = securityUtils.getEmailFromJwt(jwt);
        return ResponseEntity.ok(studentService.getStudentsByEducatorEmail(email, search, pageable));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total count of unique students")
    public ResponseEntity<Long> getStudentCount(@AuthenticationPrincipal Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        return ResponseEntity.ok(studentService.countStudentsByEducatorEmail(email));
    }
}
