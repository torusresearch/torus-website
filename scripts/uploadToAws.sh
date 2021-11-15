#!/usr/bin/env bash
PACKAGE_VERSION=$(cat package.json \
  | grep '"version"' \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')
URL=''
if [[ "$GITHUB_REF" = 'refs/heads/master' ]]; then
  URL=$(echo s3://app.tor.us/v"$PACKAGE_VERSION" | tr -d ' ')
elif [[ "$GITHUB_REF" = 'refs/heads/binance' ]]; then
  URL=$(echo s3://binance.tor.us/v"$PACKAGE_VERSION" | tr -d ' ')
fi
aws s3 rm $URL --recursive
cd dist
aws s3 cp . $URL --recursive