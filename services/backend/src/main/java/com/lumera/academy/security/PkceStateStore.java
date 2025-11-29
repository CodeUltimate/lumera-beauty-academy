package com.lumera.academy.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@Component
@ConditionalOnProperty(name = "app.auth.enabled", havingValue = "true", matchIfMissing = false)
public class PkceStateStore {

    private static final long STATE_TTL_SECONDS = 600; // 10 minutes

    private final Map<String, StateData> stateCache = new ConcurrentHashMap<>();

    public StateData save(String redirectUri, String codeVerifier) {
        String state = UUID.randomUUID().toString();
        StateData data = new StateData(state, redirectUri, codeVerifier, Instant.now());
        stateCache.put(state, data);
        return data;
    }

    public Optional<StateData> consume(String state) {
        StateData data = stateCache.remove(state);
        if (data == null) {
            return Optional.empty();
        }
        if (Instant.now().isAfter(data.createdAt().plusSeconds(STATE_TTL_SECONDS))) {
            return Optional.empty();
        }
        return Optional.of(data);
    }

    public record StateData(String state, String redirectUri, String codeVerifier, Instant createdAt) {
    }
}
