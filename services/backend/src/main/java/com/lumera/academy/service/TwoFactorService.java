package com.lumera.academy.service;

import com.lumera.academy.config.KeycloakConfig;
import com.lumera.academy.dto.TwoFactorSetupDTO;
import com.lumera.academy.entity.User;
import com.lumera.academy.exception.BadRequestException;
import com.lumera.academy.exception.ResourceNotFoundException;
import com.lumera.academy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TwoFactorService {

    private static final String ISSUER = "Luméra Beauty Academy";
    private static final int SECRET_SIZE = 20; // 160 bits
    private static final int CODE_DIGITS = 6;
    private static final int TIME_STEP_SECONDS = 30;

    private final KeycloakConfig keycloakConfig;
    private final WebClient.Builder webClientBuilder;
    private final UserRepository userRepository;

    /**
     * Generate a new TOTP secret and return setup information
     */
    public TwoFactorSetupDTO generateSetup(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Generate a random secret
        byte[] secretBytes = new byte[SECRET_SIZE];
        new SecureRandom().nextBytes(secretBytes);
        String secret = Base32.encode(secretBytes);

        // Create the otpauth URI for QR code
        String qrCodeUri = buildOtpAuthUri(secret, email);

        // Format secret for manual entry (groups of 4)
        String manualEntryKey = formatSecretForDisplay(secret);

        return TwoFactorSetupDTO.builder()
                .secret(secret)
                .qrCodeUri(qrCodeUri)
                .manualEntryKey(manualEntryKey)
                .issuer(ISSUER)
                .accountName(email)
                .build();
    }

    /**
     * Verify the TOTP code and enable 2FA for the user
     */
    public boolean verifyAndEnable(String email, String secret, String code) {
        // Verify the code against the secret
        if (!verifyCode(secret, code)) {
            throw new BadRequestException("Invalid verification code. Please try again.");
        }

        // Get user from Keycloak and add the TOTP credential
        try {
            String adminToken = getAdminToken();
            String userId = getKeycloakUserId(adminToken, email);

            // Add TOTP credential to Keycloak
            addTotpCredential(adminToken, userId, secret);

            log.info("2FA enabled for user: {}", email);
            return true;
        } catch (WebClientResponseException e) {
            log.error("Failed to enable 2FA in Keycloak: {}", e.getResponseBodyAsString());
            throw new BadRequestException("Failed to enable 2FA. Please try again.");
        }
    }

    /**
     * Check if 2FA is enabled for a user
     */
    public boolean isEnabled(String email) {
        try {
            String adminToken = getAdminToken();
            String userId = getKeycloakUserId(adminToken, email);

            List<?> credentials = webClientBuilder.build()
                    .get()
                    .uri(keycloakConfig.getAdminUrl() + "/users/" + userId + "/credentials")
                    .header("Authorization", "Bearer " + adminToken)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            if (credentials != null) {
                return credentials.stream()
                        .anyMatch(c -> {
                            if (c instanceof Map) {
                                return "otp".equals(((Map<?, ?>) c).get("type"));
                            }
                            return false;
                        });
            }
            return false;
        } catch (Exception e) {
            log.error("Failed to check 2FA status", e);
            return false;
        }
    }

    /**
     * Disable 2FA for a user
     */
    public void disable(String email) {
        try {
            String adminToken = getAdminToken();
            String userId = getKeycloakUserId(adminToken, email);

            // Get all credentials
            List<Map<String, Object>> credentials = webClientBuilder.build()
                    .get()
                    .uri(keycloakConfig.getAdminUrl() + "/users/" + userId + "/credentials")
                    .header("Authorization", "Bearer " + adminToken)
                    .retrieve()
                    .bodyToFlux(Map.class)
                    .map(m -> (Map<String, Object>) m)
                    .collectList()
                    .block();

            if (credentials != null) {
                for (Map<String, Object> credential : credentials) {
                    if ("otp".equals(credential.get("type"))) {
                        String credentialId = (String) credential.get("id");
                        webClientBuilder.build()
                                .delete()
                                .uri(keycloakConfig.getAdminUrl() + "/users/" + userId + "/credentials/" + credentialId)
                                .header("Authorization", "Bearer " + adminToken)
                                .retrieve()
                                .bodyToMono(Void.class)
                                .block();
                        log.info("2FA disabled for user: {}", email);
                    }
                }
            }
        } catch (WebClientResponseException e) {
            log.error("Failed to disable 2FA: {}", e.getResponseBodyAsString());
            throw new BadRequestException("Failed to disable 2FA. Please try again.");
        }
    }

    private String buildOtpAuthUri(String secret, String email) {
        String encodedIssuer = URLEncoder.encode(ISSUER, StandardCharsets.UTF_8);
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
        return String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=%d&period=%d",
                encodedIssuer, encodedEmail, secret, encodedIssuer, CODE_DIGITS, TIME_STEP_SECONDS
        );
    }

    private String formatSecretForDisplay(String secret) {
        StringBuilder formatted = new StringBuilder();
        for (int i = 0; i < secret.length(); i += 4) {
            if (i > 0) formatted.append(" ");
            formatted.append(secret, i, Math.min(i + 4, secret.length()));
        }
        return formatted.toString();
    }

    private boolean verifyCode(String secret, String code) {
        try {
            byte[] secretBytes = Base32.decode(secret);
            long timeStep = System.currentTimeMillis() / 1000 / TIME_STEP_SECONDS;

            // Check current time step and one before/after for clock drift
            for (int i = -1; i <= 1; i++) {
                String generatedCode = generateTOTP(secretBytes, timeStep + i);
                if (generatedCode.equals(code)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            log.error("Error verifying TOTP code", e);
            return false;
        }
    }

    private String generateTOTP(byte[] secret, long timeStep) throws NoSuchAlgorithmException, InvalidKeyException {
        byte[] timeBytes = new byte[8];
        for (int i = 7; i >= 0; i--) {
            timeBytes[i] = (byte) (timeStep & 0xff);
            timeStep >>= 8;
        }

        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(secret, "HmacSHA1"));
        byte[] hash = mac.doFinal(timeBytes);

        int offset = hash[hash.length - 1] & 0xf;
        int binary = ((hash[offset] & 0x7f) << 24)
                | ((hash[offset + 1] & 0xff) << 16)
                | ((hash[offset + 2] & 0xff) << 8)
                | (hash[offset + 3] & 0xff);

        int otp = binary % (int) Math.pow(10, CODE_DIGITS);
        return String.format("%0" + CODE_DIGITS + "d", otp);
    }

    private String getAdminToken() {
        Map<?, ?> response = webClientBuilder.build()
                .post()
                .uri(keycloakConfig.getTokenUrl())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue("grant_type=client_credentials&client_id=" + keycloakConfig.getClientId()
                        + "&client_secret=" + keycloakConfig.getClientSecret())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response != null ? (String) response.get("access_token") : null;
    }

    private String getKeycloakUserId(String adminToken, String email) {
        List<?> users = webClientBuilder.build()
                .get()
                .uri(keycloakConfig.getAdminUrl() + "/users?email=" + URLEncoder.encode(email, StandardCharsets.UTF_8) + "&exact=true")
                .header("Authorization", "Bearer " + adminToken)
                .retrieve()
                .bodyToMono(List.class)
                .block();

        if (users == null || users.isEmpty()) {
            throw new ResourceNotFoundException("User", "email", email);
        }

        Map<?, ?> user = (Map<?, ?>) users.get(0);
        return (String) user.get("id");
    }

    private void addTotpCredential(String adminToken, String userId, String secret) {
        // The Keycloak Admin API requires a specific format for adding OTP credentials
        Map<String, Object> credentialData = Map.of(
                "type", "otp",
                "secretData", "{\"value\":\"" + secret + "\"}",
                "credentialData", "{\"subType\":\"totp\",\"period\":" + TIME_STEP_SECONDS + ",\"digits\":" + CODE_DIGITS + ",\"algorithm\":\"HmacSHA1\"}",
                "userLabel", "Authenticator App"
        );

        webClientBuilder.build()
                .post()
                .uri(keycloakConfig.getAdminUrl() + "/users/" + userId + "/credentials")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(credentialData)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    /**
     * Base32 encoding/decoding helper
     */
    private static class Base32 {
        private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

        public static String encode(byte[] data) {
            StringBuilder result = new StringBuilder();
            int buffer = 0;
            int bitsInBuffer = 0;

            for (byte b : data) {
                buffer = (buffer << 8) | (b & 0xff);
                bitsInBuffer += 8;
                while (bitsInBuffer >= 5) {
                    int index = (buffer >> (bitsInBuffer - 5)) & 0x1f;
                    result.append(ALPHABET.charAt(index));
                    bitsInBuffer -= 5;
                }
            }

            if (bitsInBuffer > 0) {
                int index = (buffer << (5 - bitsInBuffer)) & 0x1f;
                result.append(ALPHABET.charAt(index));
            }

            return result.toString();
        }

        public static byte[] decode(String encoded) {
            encoded = encoded.toUpperCase().replaceAll("[^A-Z2-7]", "");
            byte[] result = new byte[encoded.length() * 5 / 8];
            int buffer = 0;
            int bitsInBuffer = 0;
            int resultIndex = 0;

            for (char c : encoded.toCharArray()) {
                int value = ALPHABET.indexOf(c);
                if (value < 0) continue;

                buffer = (buffer << 5) | value;
                bitsInBuffer += 5;

                if (bitsInBuffer >= 8) {
                    result[resultIndex++] = (byte) ((buffer >> (bitsInBuffer - 8)) & 0xff);
                    bitsInBuffer -= 8;
                }
            }

            return result;
        }
    }
}
