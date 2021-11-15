#!/bin/bash

PACKAGE_VERSION=$(cat package.json \
  | grep '"version"' \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | xargs)

if [[ "$GITHUB_REF" = 'refs/heads/master' ]]; then
  SENTRY_PROJECT='torus-website'
elif [[ "$GITHUB_REF" = 'refs/heads/binance' ]]; then
  SENTRY_PROJECT='binance-torus-website'
fi

SENTRY_ORG=torus

./node_modules/.bin/sentry-cli releases -o $SENTRY_ORG -p $SENTRY_PROJECT files "${SENTRY_PROJECT}@v${PACKAGE_VERSION}" \
    upload-sourcemaps --url-prefix "~/v${PACKAGE_VERSION}/js" --validate dist/js