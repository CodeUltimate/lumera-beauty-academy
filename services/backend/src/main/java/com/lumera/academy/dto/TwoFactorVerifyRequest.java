package com.lumera.academy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TwoFactorVerifyRequest {
    @NotBlank(message = "Verification code is required")
    @Pattern(regexp = "^\\d{6}$", message = "Code must be 6 digits")
    private String code;

    @NotBlank(message = "Secret is required")
    private String secret;
}
