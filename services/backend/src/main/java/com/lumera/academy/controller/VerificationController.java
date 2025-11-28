package com.lumera.academy.controller;

import com.lumera.academy.dto.UserDTO;
import com.lumera.academy.entity.User;
import com.lumera.academy.service.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/verification")
@RequiredArgsConstructor
@Tag(name = "Email Verification", description = "Email verification endpoints")
public class VerificationController {

    private final EmailVerificationService verificationService;

    @PostMapping("/verify")
    @Operation(summary = "Verify email address using token")
    public ResponseEntity<UserDTO> verifyEmail(@RequestParam @NotBlank String token) {
        User user = verificationService.verifyEmail(token);
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    @PostMapping("/resend")
    @Operation(summary = "Resend verification email")
    public ResponseEntity<Map<String, String>> resendVerification(
            @RequestParam @NotBlank @Email String email) {
        verificationService.resendVerificationEmail(email);
        return ResponseEntity.ok(Map.of(
            "message", "Verification email sent successfully. Please check your inbox."
        ));
    }
}
