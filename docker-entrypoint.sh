#!/bin/sh
set -eu

: "${BACKEND_URL:=http://backend:8080}"
: "${DNS_RESOLVER:=127.0.0.11}"

# Se estiver rodando em container com /etc/resolv.conf válido, usa o resolver dele
if [ -f /etc/resolv.conf ] && grep -q "nameserver" /etc/resolv.conf; then
    DNS_RESOLVER=$(grep -m1 "nameserver" /etc/resolv.conf | awk '{print $2}')
fi

export BACKEND_URL DNS_RESOLVER

echo "[entrypoint] BACKEND_URL=${BACKEND_URL}"
echo "[entrypoint] DNS_RESOLVER=${DNS_RESOLVER}"

# /tmp é tmpfs mesmo com readOnlyRootFilesystem=true no K8s
OUT_DIR="/tmp/nginx-conf.d"
mkdir -p "$OUT_DIR"

envsubst '${BACKEND_URL} ${DNS_RESOLVER}' \
    < /etc/nginx/templates/default.conf.template \
    > "$OUT_DIR/default.conf"

nginx -t -c /etc/nginx/nginx.conf

exec "$@"
