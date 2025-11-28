package com.lumera.academy.controller;

import com.lumera.academy.security.SecurityUtils;
import com.lumera.academy.service.EarningsReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/v1/educator/earnings")
@PreAuthorize("hasRole('EDUCATOR')")
@RequiredArgsConstructor
@Tag(name = "Educator Earnings", description = "Educator earnings and reports endpoints")
public class EducatorEarningsController {

    private final EarningsReportService earningsReportService;
    private final SecurityUtils securityUtils;

    @GetMapping("/report/pdf")
    @Operation(summary = "Download earnings report as PDF")
    public ResponseEntity<byte[]> downloadEarningsReport(@AuthenticationPrincipal Jwt jwt) {
        String email = securityUtils.getEmailFromJwt(jwt);
        byte[] pdfBytes = earningsReportService.generateEarningsReport(email);

        String filename = String.format("earnings-report-%s.pdf",
            LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
            .headers(headers)
            .body(pdfBytes);
    }
}
