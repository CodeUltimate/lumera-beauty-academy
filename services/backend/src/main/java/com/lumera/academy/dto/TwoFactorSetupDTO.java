package com.lumera.academy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TwoFactorSetupDTO {
    private String secret;
    private String qrCodeUri;
    private String manualEntryKey;
    private String issuer;
    private String accountName;
}
