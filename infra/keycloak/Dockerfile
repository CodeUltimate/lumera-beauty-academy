FROM quay.io/keycloak/keycloak:24.0 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres

WORKDIR /opt/keycloak

# Build optimized Keycloak (without custom theme - theme loaded at runtime)
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:24.0

# Copy optimized Keycloak from builder
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy custom theme with proper ownership (only in final image)
COPY --chown=keycloak:keycloak theme/lumera /opt/keycloak/themes/lumera
COPY --chown=keycloak:keycloak realm-export.json /opt/keycloak/data/import/realm-export.json

# Ensure proper directory structure and permissions
USER root
RUN mkdir -p /opt/keycloak/data/import && \
    chown -R keycloak:keycloak /opt/keycloak/data && \
    chown -R keycloak:keycloak /opt/keycloak/themes/lumera && \
    chmod -R 755 /opt/keycloak/themes/lumera && \
    find /opt/keycloak/themes/lumera -type f -exec chmod 644 {} \;
USER keycloak

# Set environment variables for startup
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres
# Force overwrite realm on import to pick up configuration changes
ENV KC_SPI_IMPORT_IMPORTER_SINGLE_FILE_STRATEGY=OVERWRITE

# ENTRYPOINT is already set in base image to /opt/keycloak/bin/kc.sh
# Pass arguments via CMD
CMD ["start", "--optimized", "--import-realm", "--hostname-strict=false", "--http-enabled=true", "--proxy-headers=xforwarded", "--http-port=8180"]
