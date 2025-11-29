#!/bin/bash
# Keycloak startup script
# Uses PORT env var if set (for platforms like Railway/Heroku), defaults to 8080

exec /opt/keycloak/bin/kc.sh start \
    --optimized \
    --import-realm \
    --hostname-strict=false \
    --http-enabled=true \
    --proxy=edge \
    --http-port=${PORT:-8080}
