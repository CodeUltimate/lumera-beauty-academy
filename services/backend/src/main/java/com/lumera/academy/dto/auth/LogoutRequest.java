package com.lumera.academy.dto.auth;

import lombok.Data;

@Data
public class LogoutRequest {

    private String refreshToken;
}
