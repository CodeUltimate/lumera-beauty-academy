package com.lumera.academy.controller;

import com.lumera.academy.dto.TwoFactorSetupDTO;
import com.lumera.academy.dto.TwoFactorVerifyRequest;
import com.lumera.academy.service.TwoFactorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/user/2fa")
@RequiredArgsConstructor
public class TwoFactorController {

    private final TwoFactorService twoFactorService;

    /**
     * Generate a new TOTP setup (secret and QR code URI)
     */
    @GetMapping("/setup")
    public ResponseEntity<TwoFactorSetupDTO> getSetup(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        TwoFactorSetupDTO setup = twoFactorService.generateSetup(email);
        return ResponseEntity.ok(setup);
    }

    /**
     * Verify the code and enable 2FA for the user
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyAndEnable(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody TwoFactorVerifyRequest request) {
        String email = jwt.getClaimAsString("email");
        boolean success = twoFactorService.verifyAndEnable(email, request.getSecret(), request.getCode());
        return ResponseEntity.ok(Map.of(
                "success", success,
                "message", "Two-factor authentication has been enabled successfully"
        ));
    }

    /**
     * Check if 2FA is enabled for the current user
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getStatus(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        boolean enabled = twoFactorService.isEnabled(email);
        return ResponseEntity.ok(Map.of("enabled", enabled));
    }

    /**
     * Disable 2FA for the current user
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> disable(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        twoFactorService.disable(email);
        return ResponseEntity.ok(Map.of("message", "Two-factor authentication has been disabled"));
    }
}
