#!/bin/bash
# minimal placeholder to generate self-signed certs
mkdir -p certs
openssl req -new -x509 -nodes -days 365 -subj "/CN=localhost" \
  -out certs/server.crt -keyout certs/server.key >/dev/null 2>&1
