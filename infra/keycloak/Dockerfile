FROM quay.io/keycloak/keycloak:24.0 AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres

# Copy custom theme
COPY theme/lumera /opt/keycloak/themes/lumera

# Copy realm export for import with proper permissions
COPY --chown=keycloak:keycloak realm-export.json /opt/keycloak/data/import/realm-export.json

WORKDIR /opt/keycloak

# Build optimized Keycloak
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:24.0

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy custom theme with proper ownership
COPY --chown=keycloak:keycloak theme/lumera /opt/keycloak/themes/lumera

# Ensure proper permissions for all files
USER root
RUN mkdir -p /opt/keycloak/data/import && \
    chown -R keycloak:keycloak /opt/keycloak/data && \
    chmod -R 755 /opt/keycloak/themes/lumera && \
    find /opt/keycloak/themes/lumera -type f -name "*.ftl" -exec chmod 644 {} \; && \
    find /opt/keycloak/themes/lumera -type f -name "*.css" -exec chmod 644 {} \; && \
    find /opt/keycloak/themes/lumera -type f -name "*.properties" -exec chmod 644 {} \; && \
    ls -laR /opt/keycloak/themes/lumera
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
