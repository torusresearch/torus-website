#!/usr/bin/env bash
PACKAGE_VERSION=$(cat package.json \
  | grep buildVersion \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')
URL=$(echo s3://static.dev.tor.us/"$PACKAGE_VERSION" | tr -d ' ')
aws s3 rm $URL --recursive
cd dist
aws s3 cp . $URL --recursive