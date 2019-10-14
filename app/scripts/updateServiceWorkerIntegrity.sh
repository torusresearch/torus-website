#!/usr/bin/env bash
HASH="$(cat ./dist/service-worker.js | openssl dgst -sha384 -binary | openssl base64 -A)"
sed -i -e "s/SERVICE_WORKER_SHA_INTEGRITY/$HASH/g" ./dist/js/app.*