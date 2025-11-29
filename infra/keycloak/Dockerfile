FROM quay.io/keycloak/keycloak:24.0 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres

# Copy custom theme
COPY theme/lumera /opt/keycloak/themes/lumera

# Copy realm export for import
COPY realm-export.json /opt/keycloak/data/import/realm-export.json

WORKDIR /opt/keycloak

# Build optimized Keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:24.0

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy startup script
COPY start.sh /opt/keycloak/start.sh
USER root
RUN chmod +x /opt/keycloak/start.sh
USER keycloak

# Use startup script that reads PORT env var (defaults to 8080)
CMD ["/opt/keycloak/start.sh"]
