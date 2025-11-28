#!/bin/sh
set -e

# Start Keycloak in the background with permissive HTTP settings for local dev.
/opt/keycloak/bin/kc.sh start-dev \
  --http-enabled=true \
  --hostname-strict=false \
  --hostname-strict-https=false \
  --proxy=edge \
  --import-realm &

KC_PID=$!

# Wait for Keycloak to accept admin commands (retry kcadm instead of curl).
RETRIES=30
until /opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user "${KEYCLOAK_ADMIN}" --password "${KEYCLOAK_ADMIN_PASSWORD}" >/dev/null 2>&1; do
  RETRIES=$((RETRIES-1))
  if [ "$RETRIES" -le 0 ]; then
    echo "Keycloak did not become ready in time" >&2
    kill $KC_PID || true
    exit 1
  fi
  sleep 2
done

# Disable SSL requirement on master and lumera realms for local HTTP access.
/opt/keycloak/bin/kcadm.sh update realms/master -s sslRequired=NONE || true
/opt/keycloak/bin/kcadm.sh update realms/lumera -s sslRequired=NONE || true

wait $KC_PID
