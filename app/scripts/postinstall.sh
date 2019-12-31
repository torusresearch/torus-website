#!/bin/bash
echo "Applying fix for websocket error"

find ./node_modules -name ".git" -type d -exec rm -rf {} +

echo "Applying fix for connext build error"

TARGET="node_modules/ts-nkeys/lib/util.js"
sed -i'' -e 's/function parseNodeVersion() {/function parseNodeVersion() { if (typeof process === "undefined" || typeof process.version === "undefined") return 0/' $TARGET;


