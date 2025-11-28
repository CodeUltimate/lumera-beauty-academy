package com.lumera.academy.dto.auth;

import lombok.Data;

@Data
public class TokenRefreshRequest {

    private String refreshToken;
}
