#!/usr/bin/env bash
PACKAGE_VERSION=$(cat package.json \
  | grep '"version"' \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')
URL=''
if [[ "$CIRCLE_BRANCH" = 'master' ]]; then
  URL=$(echo s3://app.tor.us/v"$PACKAGE_VERSION" | tr -d ' ')
elif [[ "$CIRCLE_BRANCH" = 'binance' ]]; then
  URL=$(echo s3://binance.tor.us/v"$PACKAGE_VERSION" | tr -d ' ')
fi
aws s3 rm $URL --recursive
cd dist
aws s3 cp . $URL --recursive